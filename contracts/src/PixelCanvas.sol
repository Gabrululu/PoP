// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title PixelCanvas — Proof of Pixel on Celo
/// @notice Collaborative 512×512 pixel art canvas. Each pixel costs 0.01 USDm to paint.
contract PixelCanvas {
    // ─── Constants ────────────────────────────────────────────────────────────

    uint16 public constant WIDTH  = 512;
    uint16 public constant HEIGHT = 512;
    uint256 public constant PIXEL_PRICE = 0.01 ether; // 0.01 USDm (18 decimals)
    uint8   public constant MAX_COLOR   = 7;           // palette indices 0-7

    // Celo Sepolia testnet USDm address (same as mainnet for Mento)
    address public immutable usdm;
    address public immutable owner;

    // ─── State ────────────────────────────────────────────────────────────────

    /// @dev Pixel ID = x + y * WIDTH. Stores packed color (uint8) + painter (address).
    mapping(uint32 => address) public pixelPainter;
    mapping(uint32 => uint8)   public pixelColor;

    uint256 public totalPainted;
    uint256 public totalRevenue; // in USDm (18 decimals)

    // ─── Events ───────────────────────────────────────────────────────────────

    event PixelPainted(
        address indexed painter,
        uint16 indexed x,
        uint16 indexed y,
        uint8 colorIndex,
        uint256 timestamp
    );

    event Withdrawn(address indexed to, uint256 amount);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error OutOfBounds(uint16 x, uint16 y);
    error InvalidColor(uint8 colorIndex);
    error PaymentFailed();
    error NotOwner();
    error ZeroBalance();

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _usdm) {
        usdm  = _usdm;
        owner = msg.sender;
    }

    // ─── Core ─────────────────────────────────────────────────────────────────

    /// @notice Paint a pixel. Caller must have approved at least 0.01 USDm to this contract.
    /// @param x         Column (0–511)
    /// @param y         Row (0–511)
    /// @param colorIndex Palette index (0–7)
    function paintPixel(uint16 x, uint16 y, uint8 colorIndex) external {
        if (x >= WIDTH || y >= HEIGHT) revert OutOfBounds(x, y);
        if (colorIndex > MAX_COLOR)    revert InvalidColor(colorIndex);

        bool ok = IERC20(usdm).transferFrom(msg.sender, address(this), PIXEL_PRICE);
        if (!ok) revert PaymentFailed();

        uint32 id = _pixelId(x, y);
        pixelPainter[id] = msg.sender;
        pixelColor[id]   = colorIndex;

        unchecked {
            ++totalPainted;
            totalRevenue += PIXEL_PRICE;
        }

        emit PixelPainted(msg.sender, x, y, colorIndex, block.timestamp);
    }

    /// @notice Paint multiple pixels in one transaction (batch — cheaper gas per pixel).
    /// @dev    Caller must approve WIDTH*HEIGHT*0.01 USDm for a full canvas fill.
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
            uint16 x = xs[i];
            uint16 y = ys[i];
            uint8  c = colorIndexes[i];

            if (x >= WIDTH || y >= HEIGHT) revert OutOfBounds(x, y);
            if (c > MAX_COLOR)             revert InvalidColor(c);

            uint32 id = _pixelId(x, y);
            pixelPainter[id] = msg.sender;
            pixelColor[id]   = c;

            emit PixelPainted(msg.sender, x, y, c, block.timestamp);

            unchecked { ++i; }
        }

        unchecked {
            totalPainted += len;
            totalRevenue += total;
        }
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /// @notice Returns color and painter for a pixel.
    function getPixel(uint16 x, uint16 y)
        external view
        returns (uint8 color, address painter)
    {
        uint32 id = _pixelId(x, y);
        color   = pixelColor[id];
        painter = pixelPainter[id];
    }

    /// @notice Returns contract's accumulated USDm balance.
    function contractBalance() external view returns (uint256) {
        return IERC20(usdm).balanceOf(address(this));
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /// @notice Withdraw accumulated USDm to owner.
    function withdraw() external {
        if (msg.sender != owner) revert NotOwner();
        uint256 bal = IERC20(usdm).balanceOf(address(this));
        if (bal == 0) revert ZeroBalance();
        bool ok = IERC20(usdm).transfer(owner, bal);
        if (!ok) revert PaymentFailed();
        emit Withdrawn(owner, bal);
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _pixelId(uint16 x, uint16 y) internal pure returns (uint32) {
        return uint32(x) + uint32(y) * WIDTH;
    }
}
