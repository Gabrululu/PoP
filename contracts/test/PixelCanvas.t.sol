// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/PixelCanvas.sol";

/// @dev Minimal ERC-20 mock for tests
contract MockUSDm {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount, "allowance");
        require(balanceOf[from] >= amount, "balance");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to]   += amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to]         += amount;
        return true;
    }
}

contract PixelCanvasTest is Test {
    PixelCanvas canvas;
    MockUSDm    usdm;

    address alice = makeAddr("alice");
    address bob   = makeAddr("bob");

    uint256 constant PRICE = 0.01 ether;

    function setUp() public {
        usdm   = new MockUSDm();
        canvas = new PixelCanvas(address(usdm));

        // Fund alice and bob with 10 USDm each
        usdm.mint(alice, 10 ether);
        usdm.mint(bob,   10 ether);
    }

    // ─── paintPixel ───────────────────────────────────────────────────────────

    function test_paintPixel_success() public {
        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);
        canvas.paintPixel(0, 0, 1);
        vm.stopPrank();

        (uint8 color, address painter) = canvas.getPixel(0, 0);
        assertEq(color,   1);
        assertEq(painter, alice);
        assertEq(canvas.totalPainted(), 1);
        assertEq(canvas.totalRevenue(), PRICE);
    }

    function test_paintPixel_emitsEvent() public {
        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);

        vm.expectEmit(true, true, true, true);
        emit PixelCanvas.PixelPainted(alice, 10, 20, 3, block.timestamp);
        canvas.paintPixel(10, 20, 3);
        vm.stopPrank();
    }

    function test_paintPixel_overwrite() public {
        // alice paints pixel
        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);
        canvas.paintPixel(5, 5, 0);
        vm.stopPrank();

        // bob reclaims same pixel
        vm.startPrank(bob);
        usdm.approve(address(canvas), PRICE);
        canvas.paintPixel(5, 5, 7);
        vm.stopPrank();

        (uint8 color, address painter) = canvas.getPixel(5, 5);
        assertEq(color,   7);
        assertEq(painter, bob);
        assertEq(canvas.totalPainted(), 2);
    }

    function test_paintPixel_revert_outOfBounds() public {
        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);
        vm.expectRevert(abi.encodeWithSelector(PixelCanvas.OutOfBounds.selector, 512, 0));
        canvas.paintPixel(512, 0, 0);
        vm.stopPrank();
    }

    function test_paintPixel_revert_invalidColor() public {
        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);
        vm.expectRevert(abi.encodeWithSelector(PixelCanvas.InvalidColor.selector, 8));
        canvas.paintPixel(0, 0, 8);
        vm.stopPrank();
    }

    function test_paintPixel_revert_noApproval() public {
        vm.prank(alice);
        vm.expectRevert(); // MockUSDm reverts with "allowance"
        canvas.paintPixel(0, 0, 0);
    }

    // ─── paintBatch ───────────────────────────────────────────────────────────

    function test_paintBatch_success() public {
        uint16[] memory xs = new uint16[](3);
        uint16[] memory ys = new uint16[](3);
        uint8[]  memory cs = new uint8[](3);
        xs[0] = 0; ys[0] = 0; cs[0] = 0;
        xs[1] = 1; ys[1] = 0; cs[1] = 1;
        xs[2] = 2; ys[2] = 0; cs[2] = 2;

        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE * 3);
        canvas.paintBatch(xs, ys, cs);
        vm.stopPrank();

        assertEq(canvas.totalPainted(), 3);
        (uint8 c0,) = canvas.getPixel(0, 0); assertEq(c0, 0);
        (uint8 c1,) = canvas.getPixel(1, 0); assertEq(c1, 1);
        (uint8 c2,) = canvas.getPixel(2, 0); assertEq(c2, 2);
    }

    function test_paintBatch_revert_emptyArray() public {
        uint16[] memory xs = new uint16[](0);
        uint16[] memory ys = new uint16[](0);
        uint8[]  memory cs = new uint8[](0);
        vm.prank(alice);
        vm.expectRevert("batch 1-500");
        canvas.paintBatch(xs, ys, cs);
    }

    // ─── withdraw ─────────────────────────────────────────────────────────────

    function test_withdraw_success() public {
        // Paint one pixel so there's revenue
        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);
        canvas.paintPixel(0, 0, 0);
        vm.stopPrank();

        address owner = canvas.owner();
        uint256 before = usdm.balanceOf(owner);
        vm.prank(owner);
        canvas.withdraw();
        assertEq(usdm.balanceOf(owner), before + PRICE);
        assertEq(canvas.contractBalance(), 0);
    }

    function test_withdraw_revert_notOwner() public {
        vm.prank(alice);
        vm.expectRevert(PixelCanvas.NotOwner.selector);
        canvas.withdraw();
    }

    function test_withdraw_revert_zeroBalance() public {
        vm.prank(canvas.owner());
        vm.expectRevert(PixelCanvas.ZeroBalance.selector);
        canvas.withdraw();
    }

    // ─── fuzz ─────────────────────────────────────────────────────────────────

    function testFuzz_paintPixel(uint16 x, uint16 y, uint8 colorIndex) public {
        x          = uint16(bound(x,          0, 511));
        y          = uint16(bound(y,          0, 511));
        colorIndex = uint8 (bound(colorIndex, 0, 7));

        vm.startPrank(alice);
        usdm.approve(address(canvas), PRICE);
        canvas.paintPixel(x, y, colorIndex);
        vm.stopPrank();

        (uint8 c, address p) = canvas.getPixel(x, y);
        assertEq(c, colorIndex);
        assertEq(p, alice);
    }
}
