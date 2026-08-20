// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title PixelCanvas v3 — Proof of Pixel on Celo
/// @notice Collaborative 512×512 canvas. 0.01 USDm/pixel.
///         80% of revenue + platform seed → prize pool for top seasonal painters.
///         Every address gets one free pixel claim per 24 hours.
contract PixelCanvas {
    uint16  public constant WIDTH        = 512;
    uint16  public constant HEIGHT       = 512;
    uint256 public constant PIXEL_PRICE  = 0.01 ether;   // 0.01 USDm (18 dec)
    uint8   public constant MAX_COLOR    = 7;
    uint256 public constant FREE_COOLDOWN = 24 hours;

    address public immutable usdm;
    address public immutable owner;

    // Canvas state
    mapping(uint32  => address) public pixelPainter;
    mapping(uint32  => uint8)   public pixelColor;

    // Leaderboard
    mapping(address => uint256) public painterPixels;   // total pixels ever painted

    // Free daily claim
    mapping(address => uint256) public lastFreeClaim;   // timestamp of last free claim

    // Financials
    uint256 public totalPainted;
    uint256 public totalRevenue;
    uint256 public prizePool;           // total available for distribution
    uint256 public platformSeeded;      // how much the platform has contributed

    // ─── Events ───────────────────────────────────────────────────────────────

    event PixelPainted(
        address indexed painter,
        uint16 indexed x,
        uint16 indexed y,
        uint8 colorIndex,
        uint256 timestamp
    );
    event FreeClaimed(address indexed painter, uint16 x, uint16 y, uint8 colorIndex);
    event PrizeSeeded(address indexed by, uint256 amount);
    event PrizeDistributed(address indexed winner, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error OutOfBounds(uint16 x, uint16 y);
    error InvalidColor(uint8 colorIndex);
    error PaymentFailed();
    error NotOwner();
    error ZeroBalance();
    error FreeClaimNotReady(uint256 availableAt);

    constructor(address _usdm) {
        usdm  = _usdm;
        owner = msg.sender;
    }

    // ─── Core painting ────────────────────────────────────────────────────────

    function paintPixel(uint16 x, uint16 y, uint8 colorIndex) external {
        if (x >= WIDTH || y >= HEIGHT) revert OutOfBounds(x, y);
        if (colorIndex > MAX_COLOR)    revert InvalidColor(colorIndex);

        bool ok = IERC20(usdm).transferFrom(msg.sender, address(this), PIXEL_PRICE);
        if (!ok) revert PaymentFailed();

        _paint(x, y, colorIndex, msg.sender);

        unchecked {
            totalRevenue += PIXEL_PRICE;
            prizePool    += PIXEL_PRICE * 8 / 10; // 80% to prize pool
        }

        emit PixelPainted(msg.sender, x, y, colorIndex, block.timestamp);
    }

    function paintBatch(
        uint16[] calldata xs,
        uint16[] calldata ys,
        uint8[]  calldata colorIndexes
    ) external {
        uint256 len = xs.length;
        require(len == ys.length && len == colorIndexes.length, "length mismatch");
        require(len > 0 && len <= 500, "batch 1-500");

        uint256 total = PIXEL_PRICE * len;
        bool ok = IERC20(usdm).transferFrom(msg.sender, address(this), total);
        if (!ok) revert PaymentFailed();

        for (uint256 i; i < len; ) {
            uint16 x = xs[i]; uint16 y = ys[i]; uint8 c = colorIndexes[i];
            if (x >= WIDTH || y >= HEIGHT) revert OutOfBounds(x, y);
            if (c > MAX_COLOR)             revert InvalidColor(c);
            _paint(x, y, c, msg.sender);
            emit PixelPainted(msg.sender, x, y, c, block.timestamp);
            unchecked { ++i; }
        }

        unchecked {
            totalRevenue  += total;
            prizePool     += total * 8 / 10;
        }
    }

    /// @notice One free pixel per 24 hours per address. No USDm required.
    ///         Free claims count toward the leaderboard but not the prize pool.
    function freeClaimPixel(uint16 x, uint16 y, uint8 colorIndex) external {
        if (x >= WIDTH || y >= HEIGHT) revert OutOfBounds(x, y);
        if (colorIndex > MAX_COLOR)    revert InvalidColor(colorIndex);

        uint256 available = lastFreeClaim[msg.sender] + FREE_COOLDOWN;
        if (block.timestamp < available) revert FreeClaimNotReady(available);

        lastFreeClaim[msg.sender] = block.timestamp;
        _paint(x, y, colorIndex, msg.sender);

        emit FreeClaimed(msg.sender, x, y, colorIndex);
        emit PixelPainted(msg.sender, x, y, colorIndex, block.timestamp);
    }

    // ─── Prize pool management ────────────────────────────────────────────────

    /// @notice Platform seeds the weekly prize pool. Owner must pre-approve USDm.
    function seedPrizePool(uint256 amount) external {
        if (msg.sender != owner) revert NotOwner();
        bool ok = IERC20(usdm).transferFrom(msg.sender, address(this), amount);
        if (!ok) revert PaymentFailed();
        unchecked {
            prizePool       += amount;
            platformSeeded  += amount;
        }
        emit PrizeSeeded(msg.sender, amount);
    }

    /// @notice Distribute prizes to winners (proportional, owner-triggered at season end).
    function distributePrize(address[] calldata winners, uint256[] calldata amounts) external {
        if (msg.sender != owner) revert NotOwner();
        require(winners.length == amounts.length, "length mismatch");
        for (uint256 i; i < winners.length; ) {
            uint256 amt = amounts[i];
            require(amt <= prizePool, "exceeds pool");
            prizePool -= amt;
            bool ok = IERC20(usdm).transfer(winners[i], amt);
            if (!ok) revert PaymentFailed();
            emit PrizeDistributed(winners[i], amt);
            unchecked { ++i; }
        }
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    function getPixel(uint16 x, uint16 y) external view returns (uint8 color, address painter) {
        uint32 id = _pixelId(x, y);
        color   = pixelColor[id];
        painter = pixelPainter[id];
    }

    function contractBalance() external view returns (uint256) {
        return IERC20(usdm).balanceOf(address(this));
    }

    /// @notice Returns whether address can free-claim now, and if not, when.
    function freeClaimStatus(address user) external view returns (bool canClaim, uint256 availableAt) {
        availableAt = lastFreeClaim[user] + FREE_COOLDOWN;
        canClaim    = block.timestamp >= availableAt;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /// @notice Withdraw dev share (total balance minus prize pool).
    function withdraw() external {
        if (msg.sender != owner) revert NotOwner();
        uint256 bal       = IERC20(usdm).balanceOf(address(this));
        uint256 available = bal > prizePool ? bal - prizePool : 0;
        if (available == 0) revert ZeroBalance();
        bool ok = IERC20(usdm).transfer(owner, available);
        if (!ok) revert PaymentFailed();
        emit Withdrawn(owner, available);
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _paint(uint16 x, uint16 y, uint8 colorIndex, address painter) internal {
        uint32 id = _pixelId(x, y);
        pixelPainter[id] = painter;
        pixelColor[id]   = colorIndex;
        unchecked {
            ++totalPainted;
            ++painterPixels[painter];
        }
    }

    function _pixelId(uint16 x, uint16 y) internal pure returns (uint32) {
        return uint32(x) + uint32(y) * WIDTH;
    }
}
