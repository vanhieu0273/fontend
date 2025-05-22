import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../../context/ShopContextReal";
import { assets } from "../../../assets/frontend_assets/assets";
import Title from "../../../components/Title";
import ProductItem from "../../../components/ProductItem";
import axiosInstance from "../../../config/axios";
import { Pagination, Radio } from "antd";

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

  console.log("categoryId", categoryId);
  

  const getListProducts = async () => {
    setLoadingFetchData(true);
    await axiosInstance
      .get("/products", {
        params: {
          maxPrice: 200000,
          minPrice: 0,
          page: currentPage,
          limit: defaultLimit,
          category: categoryId,
        },
      })
      .then((res) => {
        setFilterProducts(res.data?.products);
        setTotalPage(Number(res.data?.totalPages));
        setCurrentPage(Number(res.data?.currentPage));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingFetchData(false);
      });
  };

  const getCategory = async () => {
    await axiosInstance
      .get("/categories")
      .then((res) => {
        console.log("res.data.categories", res.data.categories);

        setListCategory(res.data.categories).map((item) => ({
          label: item.name,
          value: item._id,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getListProducts();
  }, [currentPage, categoryId]); // khi currentPage, categoryId thay đổi thì gọi lại hàm getListProducts

  useEffect(() => {
    getCategory();
  }, []); // chi chạy 1 lần khi component mount

  const handlePageChange = (current, pageSize) => {
    console.log("current", current, pageSize);
    setCurrentPage(current);
    setTotalPage(pageSize);
  };

  const onChangeCate = (e) => {
    setCategoryId(e.target.value);
  };

  

  const appLyFilter = () => {
    // let productsCopy = products.slice();
    // if(showSearch && search){
    //   productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    // }
    // if(category.length > 0){
    //   productsCopy = productsCopy.filter(item => category.includes(item.category));
    // }
    // if(subCategory.length > 0){
    //   productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    // }
    // setFilterProducts(productsCopy)
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        appLyFilter();
        break;
    }
  };

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/** fillter options  */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category filters */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
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
        </div>
        {/* subcategory filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          {/* <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />{" "}
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />{" "}
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />{" "}
              Winterwear
            </p>
          </div> */}
        </div>
      </div>
      {/** product list */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 boder-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by : Relavent</option>
            <option value="low-high">Sort by : Low To High</option>
            <option value="high-low">Sort by : High To Low</option>
          </select>
        </div>
        {/* map products */}
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
