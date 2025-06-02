import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../../context/ShopContextReal";
import { assets } from "../../../assets/frontend_assets/assets";
import Title from "../../../components/Title";
import ProductItem from "../../../components/ProductItem";
import axiosInstance from "../../../config/axios";
import { Pagination, Radio, Slider } from "antd";

const defaultLimit = 9;

export default function ListProduct() {
  const { search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [listCategory, setListCategory] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [loadingFetchData, setLoadingFetchData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [listSize, setListSize] = useState([]);
  const [sizeId, setSizeId] = useState("");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [maxPriceFromData, setMaxPriceFromData] = useState(5000000); // Cố định

  const getListProducts = async () => {
    setLoadingFetchData(true);
    try {
      const res = await axiosInstance.get("/products", {
        params: {
          minPrice,
          maxPrice,
          page: currentPage,
          limit: defaultLimit,
          category: categoryId,
          sizes: sizeId,
        },
      });

      const products = res.data?.products || [];
      setFilterProducts(products);
      setTotalPage(Number(res.data?.totalPages));
      setCurrentPage(Number(res.data?.currentPage));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingFetchData(false);
    }
  };

  const getCategory = async () => {
    try {
      const res = await axiosInstance.get("/category");
      setListCategory(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getListSizes = async () => {
    try {
      const res = await axiosInstance.get("/size/list-size");
      setListSize(res.data.data || []);
    } catch (err) {
      console.log("Lỗi khi lấy size:", err);
    }
  };

  useEffect(() => {
    getListProducts();
  }, [currentPage, categoryId, sizeId, minPrice, maxPrice]);

  useEffect(() => {
    getCategory();
    getListSizes();
  }, []);

  const handlePageChange = (current, pageSize) => {
    setCurrentPage(current);
    setTotalPage(pageSize);
  };

  const onChangeCate = (e) => {
    setCategoryId(e.target.value);
  };

  const onChangeSize = (e) => {
    setSizeId(e.target.value);
  };

  const sortProduct = () => {
    let fpCopy = [...filterProducts];
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Bộ lọc */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Bộ Lọc
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="dropdown icon"
          />
        </p>

        {/* Lọc giá */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Giá (VNĐ)</p>
          <Slider
            range
            min={0}
            max={maxPriceFromData}
            value={priceRange}
            onChange={(val) => setPriceRange(val)}
            onAfterChange={(val) => {
              setMinPrice(val[0]);
              setMaxPrice(val[1]);
            }}
          />
          <div className="text-xs text-gray-600">
            Từ: {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ
          </div>
        </div>

        {/* Lọc danh mục */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Danh Mục</p>
          <Radio.Group
            onChange={onChangeCate}
            style={{ display: "flex", flexDirection: "column" }}
            value={categoryId}
            options={listCategory.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
          />
        </div>

        {/* Lọc kích cỡ */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Kích Cỡ</p>
          <Radio.Group
            onChange={onChangeSize}
            style={{ display: "flex", flexDirection: "column" }}
            value={sizeId}
            options={listSize.map((size) => ({
              label: size.name,
              value: size._id,
            }))}
          />
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={""} text2={"SẢN PHẨM"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 boder-gray-300 text-sm px-2"
          >
            <option value="relavent">Liên quan</option>
            <option value="low-high">Giá Tăng Dần</option>
            <option value="high-low">Giá Giảm Dần</option>
          </select>
        </div>

        {loadingFetchData ? (
          <div className="flex justify-center items-center h-[50vh]">
            loading...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  images={item.images}
                />
              ))}
            </div>
            <Pagination
              onChange={handlePageChange}
              current={currentPage}
              total={totalPage * defaultLimit}
            />
          </>
        )}
      </div>
    </div>
  );
}
