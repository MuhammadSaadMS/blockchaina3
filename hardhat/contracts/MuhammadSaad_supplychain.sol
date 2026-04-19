// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MuhammadSaadSupplyChain is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    bytes32 public constant CUSTOMER_ROLE = keccak256("CUSTOMER_ROLE");

    enum ProductStatus {
        Manufactured,
        InTransit,
        Delivered
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        address currentOwner;
        ProductStatus status;
    }

    mapping(uint256 => Product) private products;
    mapping(uint256 => address[]) private productHistory;
    mapping(uint256 => bool) private productExists;

    event ProductRegistered(uint256 indexed id, string name, address indexed manufacturer);
    event OwnershipTransferred(uint256 indexed id, address indexed from, address indexed to, ProductStatus status);
    event ProductStatusUpdated(uint256 indexed id, ProductStatus oldStatus, ProductStatus newStatus);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANUFACTURER_ROLE, msg.sender);
    }

    function registerProduct(
        uint256 _id,
        string calldata _name,
        string calldata _description
    ) external onlyRole(MANUFACTURER_ROLE) {
        require(!productExists[_id], "Product already exists");

        products[_id] = Product({
            id: _id,
            name: _name,
            description: _description,
            currentOwner: msg.sender,
            status: ProductStatus.Manufactured
        });

        productExists[_id] = true;
        productHistory[_id].push(msg.sender);

        emit ProductRegistered(_id, _name, msg.sender);
    }

    function transferOwnership(uint256 _id, address _newOwner) external {
        require(productExists[_id], "Product does not exist");
        require(_newOwner != address(0), "Invalid new owner");

        Product storage product = products[_id];
        require(product.currentOwner == msg.sender, "Only current owner can transfer");

        if (hasRole(MANUFACTURER_ROLE, msg.sender)) {
            require(hasRole(DISTRIBUTOR_ROLE, _newOwner), "Manufacturer can transfer only to Distributor");
            product.status = ProductStatus.InTransit;
        } else if (hasRole(DISTRIBUTOR_ROLE, msg.sender)) {
            require(hasRole(RETAILER_ROLE, _newOwner), "Distributor can transfer only to Retailer");
            product.status = ProductStatus.InTransit;
        } else if (hasRole(RETAILER_ROLE, msg.sender)) {
            require(hasRole(CUSTOMER_ROLE, _newOwner), "Retailer can transfer only to Customer");
            product.status = ProductStatus.Delivered;
        } else {
            revert("Sender does not have a transferable role");
        }

        address previousOwner = product.currentOwner;
        product.currentOwner = _newOwner;
        productHistory[_id].push(_newOwner);

        emit OwnershipTransferred(_id, previousOwner, _newOwner, product.status);
    }

    function updateProductStatus(uint256 _id, ProductStatus _newStatus) external {
        require(productExists[_id], "Product does not exist");

        Product storage product = products[_id];
        require(product.currentOwner == msg.sender, "Only current owner can update status");

        ProductStatus oldStatus = product.status;
        require(uint8(_newStatus) >= uint8(oldStatus), "Status cannot go backwards");

        if (hasRole(RETAILER_ROLE, msg.sender)) {
            require(_newStatus == ProductStatus.Delivered || _newStatus == ProductStatus.InTransit, "Retailer can set InTransit or Delivered");
        } else {
            require(_newStatus != ProductStatus.Delivered || hasRole(DISTRIBUTOR_ROLE, msg.sender), "Only distributor/retailer can set Delivered");
        }

        product.status = _newStatus;
        emit ProductStatusUpdated(_id, oldStatus, _newStatus);
    }

    function getProduct(uint256 _id) external view returns (Product memory) {
        require(productExists[_id], "Product does not exist");
        return products[_id];
    }

    function getProductHistory(uint256 _id) external view returns (address[] memory) {
        require(productExists[_id], "Product does not exist");
        return productHistory[_id];
    }

    function grantSupplyRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            role == MANUFACTURER_ROLE || role == DISTRIBUTOR_ROLE || role == RETAILER_ROLE || role == CUSTOMER_ROLE,
            "Invalid role"
        );
        grantRole(role, account);
    }
}
