import React from 'react';
import './assets/css/admin.css';
import './assets/css/toast-message.css';
import './assets/css/admin-responsive.css';
import './assets/font/font-awesome-pro-v6-6.2.0/css/all.min.css';

const AdminPage = () => {
    return (
        <div>
            <header className="header">
                <button className="menu-icon-btn">
                    <div className="menu-icon">
                        <i className="fa-regular fa-bars"></i>
                    </div>
                </button>
            </header>
            <div className="container">
                <aside className="sidebar open">
                    <div className="top-sidebar">
                        <a href="#" className="channel-logo">
                            <img src="./assets/img/Binhfood.png" alt="Channel Logo" />
                        </a>
                        <div className="hidden-sidebar your-channel">
                            <img src="" style={{ height: '30px' }} alt="" />
                        </div>
                    </div>
                    <div className="middle-sidebar">
                        <ul className="sidebar-list">
                            <li className="sidebar-list-item tab-content active">
                                <a href="#" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-light fa-house"></i></div>
                                    <div className="hidden-sidebar">Trang tổng quan</div>
                                </a>
                            </li>
                            <li className="sidebar-list-item tab-content">
                                <a href="#" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-light fa-pot-food"></i></div>
                                    <div className="hidden-sidebar">Sản phẩm</div>
                                </a>
                            </li>
                            <li className="sidebar-list-item tab-content">
                                <a href="#" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-light fa-users"></i></div>
                                    <div className="hidden-sidebar">Khách hàng</div>
                                </a>
                            </li>
                            <li className="sidebar-list-item tab-content">
                                <a href="#" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-light fa-basket-shopping"></i></div>
                                    <div className="hidden-sidebar">Đơn hàng</div>
                                </a>
                            </li>
                            <li className="sidebar-list-item tab-content">
                                <a href="#" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-light fa-chart-simple"></i></div>
                                    <div className="hidden-sidebar">Thống kê</div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="bottom-sidebar">
                        <ul className="sidebar-list">
                            <li className="sidebar-list-item user-logout">
                                <a href="/" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-thin fa-circle-chevron-left"></i></div>
                                    <div className="hidden-sidebar">Trang chủ</div>
                                </a>
                            </li>
                            <li className="sidebar-list-item user-logout">
                                <a href="#" className="sidebar-link">
                                    <div className="sidebar-icon"><i className="fa-light fa-circle-user"></i></div>
                                    <div className="hidden-sidebar" id="name-acc"></div>
                                </a>
                            </li>
                            <li className="sidebar-list-item user-logout">
                                <a href="#" className="sidebar-link" id="logout-acc">
                                    <div className="sidebar-icon"><i className="fa-light fa-arrow-right-from-bracket"></i></div>
                                    <div className="hidden-sidebar">Đăng xuất</div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
                <main className="content">
                    <div className="section active">
                        <h1 className="page-title">Trang quản lý của cửa hàng BinhFood</h1>
                        <div className="cards">
                            <div className="card-single">
                                <div className="box">
                                    <h2 id="amount-user">0</h2>
                                    <div className="on-box">
                                        <img src="assets/img/admin/s1.png" alt="" style={{ width: '200px' }} />
                                        <h3>Khách hàng</h3>
                                        <p>Sản phẩm là bất cứ cái gì có thể đưa vào thị trường để tạo sự chú ý, mua sắm, sử dụng hay tiêu dùng nhằm thỏa mãn một nhu cầu hay ước muốn. Nó có thể là những vật thể, dịch vụ, con người, địa điểm, tổ chức hoặc một ý tưởng.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-single">
                                <div className="box">
                                    <div className="on-box">
                                        <img src="assets/img/admin/s2.png" alt="" style={{ width: '200px' }} />
                                        <h2 id="amount-product">0</h2>
                                        <h3>Sản phẩm</h3>
                                        <p>Khách hàng mục tiêu là một nhóm đối tượng khách hàng trong phân khúc thị trường mục tiêu mà doanh nghiệp bạn đang hướng tới.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-single">
                                <div className="box">
                                    <h2 id="doanh-thu">$5020</h2>
                                    <div className="on-box">
                                        <img src="assets/img/admin/s3.png" alt="" style={{ width: '200px' }} />
                                        <h3>Doanh thu</h3>
                                        <p>Doanh thu của doanh nghiệp là toàn bộ số tiền sẽ thu được do tiêu thụ sản phẩm, cung cấp dịch vụ với sản lượng.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Product */}
                    <div className="section product-all">
                        <div className="admin-control">
                            <div className="admin-control-left">
                                <select name="the-loai" id="the-loai" onChange={() => showProduct()}>
                                    <option>Tất cả</option>
                                    <option>Món chay</option>
                                    <option>Món mặn</option>
                                    <option>Món lẩu</option>
                                    <option>Món ăn vặt</option>
                                    <option>Món tráng miệng</option>
                                    <option>Nước uống</option>
                                    <option>Đã xóa</option>
                                </select>
                            </div>
                            <div className="admin-control-center">
                                <form action="" className="form-search">
                                    <span className="search-btn"><i className="fa-light fa-magnifying-glass"></i></span>
                                    <input id="form-search-product" type="text" className="form-search-input" placeholder="Tìm kiếm tên món..." onInput={() => showProduct()} />
                                </form>
                            </div>
                            <div className="admin-control-right">
                                <button className="btn-control-large" id="btn-cancel-product" onClick={() => cancelSearchProduct()}><i className="fa-light fa-rotate-right"></i> Làm mới</button>
                                <button className="btn-control-large" id="btn-add-product"><i className="fa-light fa-plus"></i> Thêm món mới</button>
                            </div>
                        </div>
                        <div id="show-product"></div>
                        <div className="page-nav">
                            <ul className="page-nav-list">
                            </ul>
                        </div>
                    </div>
                    {/* Account */}
                    <div className="section">
                        <div className="admin-control">
                            <div className="admin-control-left">
                                <select name="tinh-trang-user" id="tinh-trang-user" onChange={() => showUser ()}>
                                    <option value="2">Tất cả</option>
                                    <option value="1">Hoạt động</option>
                                    <option value="0">Bị khóa</option>
                                </select>
                            </div>
                            <div className="admin-control-center">
                                <form action="" className="form-search">
                                    <span className="search-btn"><i className="fa-light fa-magnifying-glass"></i></span>
                                    <input id="form-search-user" type="text" className="form-search-input" placeholder="Tìm kiếm khách hàng..." onInput={() => showUser ()} />
                                </form>
                            </div>
                            <div className="admin-control-right">
                                <form action="" className="fillter-date">
                                    <div>
                                        <label htmlFor="time-start">Từ</label>
                                        <input type="date" className="form-control-date" id="time-start-user" onChange={() => showUser ()} />
                                    </div>
                                    <div>
                                        <label htmlFor="time-end">Đến</label>
                                        <input type="date" className="form-control-date" id="time-end-user" onChange={() => showUser ()} />
                                    </div>
                                </form>
                                <button className="btn-reset-order" onClick={() => cancelSearchUser ()}><i className="fa-light fa-arrow-rotate-right"></i></button>
                                <button id="btn-add-user" className="btn-control-large" onClick={() => openCreateAccount()}><i className="fa-light fa-plus"></i> <span>Thêm khách hàng</span></button>
                            </div>
                        </div>
                        <div className="table">
                            <table width="100%">
                                <thead>
                                    <tr>
                                        <td>STT</td>
                                        <td>Họ và tên</td>
                                        <td>Liên hệ</td>
                                        <td>Ngày tham gia</td>
                                        <td>Tình trạng</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="show-user">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Order */}
                    <div className="section">
                        <div className="admin-control">
                            <div className="admin-control-left">
                                <select name="tinh-trang" id="tinh-trang" onChange={() => findOrder()}>
                                    <option value="2">Tất cả</option>
                                    <option value="1">Đã xử lý</option>
                                    <option value="0">Chưa xử lý</option>
                                </select>
                            </div>
                            <div className="admin-control-center">
                                <form action="" className="form-search">
                                    <span className="search-btn"><i className="fa-light fa-magnifying-glass"></i></span>
                                    <input id="form-search-order" type="text" className="form-search-input" placeholder="Tìm kiếm mã đơn, khách hàng..." onInput={() => findOrder()} />
                                </form>
                            </div>
                            <div className="admin-control-right">
                                <form action="" className="fillter-date">
                                    <div>
                                        <label htmlFor="time-start">Từ</label>
                                        <input type="date" className="form-control-date" id="time-start" onChange={() => findOrder()} />
                                    </div>
                                    <div>
                                        <label htmlFor="time-end">Đến</label>
                                        <input type="date" className="form-control-date" id="time-end" onChange={() => findOrder()} />
                                    </div>
                                </form>
                                <button className="btn-reset-order" onClick={() => cancelSearchOrder()}><i className="fa-light fa-arrow-rotate-right"></i></button>
                            </div>
                        </div>
                        <div className="table">
                            <table width="100%">
                                <thead>
                                    <tr>
                                        <td>Mã đơn</td>
                                        <td>Khách hàng</td>
                                        <td>Ngày đặt</td>
                                        <td>Tổng tiền</td>
                                        <td>Trạng thái</td>
                                        <td>Thao tác</td>
                                    </tr>
                                </thead>
                                <tbody id="showOrder">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="section">
                        <div className="admin-control">
                            <div className="admin-control-left">
                                <select name="the-loai-tk" id="the-loai-tk" onChange={() => thongKe()}>
                                    <option>Tất cả</option>
                                    <option>Món chay</option>
                                    <option>Món mặn</option>
                                    <option>Món lẩu</option>
                                    <option>Món ăn vặt</option>
                                    <option>Món tráng miệng</option>
                                    <option>Nước uống</option>
                                    <option>Món khác</option>
                                </select>
                            </div>
                            <div className="admin-control-center">
                                <form action="" className="form-search">
                                    <span className="search-btn"><i className="fa-light fa-magnifying-glass"></i></span>
                                    <input id="form-search-tk" type="text" className="form-search-input" placeholder="Tìm kiếm tên món..." onInput={() => thongKe()} />
                                </form>
                            </div>
                            <div className="admin-control-right">
                                <form action="" className="fillter-date">
                                    <div>
                                        <label htmlFor="time-start">Từ</label>
                                        <input type="date" className="form-control-date" id="time-start-tk" onChange={() => thongKe()} />
                                    </div>
                                    <div>
                                        <label htmlFor="time-end">Đến</label>
                                        <input type="date" className="form-control-date" id="time-end-tk" onChange={() => thongKe()} />
                                    </div>
                                </form>
                                <button className="btn-reset-order" onClick={() => thongKe(1)}><i className="fa-regular fa-arrow-up-short-wide"></i></button>
                                <button className="btn-reset-order" onClick={() => thongKe(2)}><i className="fa-regular fa-arrow-down-wide-short"></i></button>
                                <button className="btn-reset-order" onClick={() => thongKe(0)}><i className="fa-light fa-arrow-rotate-right"></i></button>
                            </div>
                        </div>
                        <div className="order-statistical" id="order-statistical">
                            <div className="order-statistical-item">
                                <div className="order-statistical-item-content">
                                    <p className="order-statistical-item-content-desc">Sản phẩm được bán ra</p>
                                    <h4 className="order-statistical-item-content-h" id="quantity-product"></h4>
                                </div>
                                <div className="order-statistical-item-icon">
                                    <i className="fa-light fa-salad"></i>
                                </div>
                            </div>
                            <div className="order-statistical-item">
                                <div className="order-statistical-item-content">
                                    <p className="order-statistical-item-content-desc">Số lượng bán ra</p>
                                    <h4 className="order-statistical-item-content-h" id="quantity-order"></h4>
                                </div>
                                <div className="order-statistical-item-icon">
                                    <i className="fa-light fa-file-lines"></i>
                                </div>
                            </div>
                            <div className="order-statistical-item">
                                <div className="order-statistical-item-content">
                                    <p className="order-statistical-item-content-desc">Doanh thu</p>
                                    <h4 className="order-statistical-item-content-h" id="quantity-sale"></h4>
                                </div>
                                <div className="order-statistical-item-icon">
                                    <i className="fa-light fa-dollar-sign"></i>
                                </div>
                            </div>
                        </div>
                        <div className="table">
                            <table width="100%">
                                <thead>
                                    <tr>
                                        <td>STT</td>
                                        <td>Tên món</td>
                                        <td>Số lượng bán</td>
                                        <td>Doanh thu</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="showTk">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            <div className="modal add-product">
                <div className="modal-container">
                    <h3 className="modal-container-title add-product-e">THÊM MỚI SẢN PHẨM</h3>
                    <h3 className="modal-container-title edit-product-e">CHỈNH SỬA SẢN PHẨM</h3>
                    <button className="modal-close product-form"><i className="fa-regular fa-xmark"></i></button>
                    <div className="modal-content">
                        <form action="" className="add-product-form">
                            <div className="modal-content-left">
                                <img src="./assets/img/blank-image.png" alt="" className="upload-image-preview" />
                                <div className="form-group file">
                                    <label htmlFor="up-hinh-anh" className="form-label-file"><i className="fa-regular fa-cloud-arrow-up"></i>Chọn hình ảnh</label>
                                    <input accept="image/jpeg, image/png, image/jpg" id="up-hinh-anh" name="up-hinh-anh" type="file" className="form-control" onChange={(e) => uploadImage(e.target)} />
                                </div>
                            </div>
                            <div className="modal-content-right">
                                <div className="form-group">
                                    <label htmlFor="ten-mon" className="form-label">Tên món</label>
                                    <input id="ten-mon" name="ten-mon" type="text" placeholder="Nhập tên món" className="form-control" />
                                    <span className="form-message"></span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">Chọn món</label>
                                    <select name="category" id="chon-mon">
                                        <option>Món chay</option>
                                        <option>Món mặn</option>
                                        <option>Món lẩu</option>
                                        <option>Món ăn vặt</option>
                                        <option>Món tráng miệng</option>
                                        <option>Nước uống</option>
                                    </select>
                                                                        <span className="form-message"></span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gia-moi" className="form-label">Giá bán</label>
                                    <input id="gia-moi" name="gia-moi" type="text" placeholder="Nhập giá bán" className="form-control" />
                                    <span className="form-message"></span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mo-ta" className="form-label">Mô tả</label>
                                    <textarea className="product-desc" id="mo-ta" placeholder="Nhập mô tả món ăn..."></textarea>
                                    <span className="form-message"></span>
                                </div>
                                <button className="form-submit btn-add-product-form add-product-e" id="add-product-button" type="submit">
                                    <i className="fa-regular fa-plus"></i>
                                    <span>THÊM MÓN</span>
                                </button>
                                <button className="form-submit btn-update-product-form edit-product-e" id="update-product-button" type="submit">
                                    <i className="fa-light fa-pencil"></i>
                                    <span>LƯU THAY ĐỔI</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal detail-order">
                <div className="modal-container">
                    <h3 className="modal-container-title">CHI TIẾT ĐƠN HÀNG</h3>
                    <button className="modal-close"><i className="fa-regular fa-xmark"></i></button>
                    <div className="modal-detail-order"></div>
                    <div className="modal-detail-bottom"></div>
                </div>
            </div>
            <div className="modal detail-order-product">
                <div className="modal-container">
                    <button className="modal-close"><i className="fa-regular fa-xmark"></i></button>
                    <div className="table">
                        <table width="100%">
                            <thead>
                                <tr>
                                    <td>Mã đơn</td>
                                    <td>Số lượng</td>
                                    <td>Đơn giá</td>
                                    <td>Ngày đặt</td>
                                </tr>
                            </thead>
                            <tbody id="show-product-order-detail"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="modal signup">
                <div className="modal-container">
                    <h3 className="modal-container-title add-account-e">THÊM KHÁCH HÀNG MỚI</h3>
                    <h3 className="modal-container-title edit-account-e">CHỈNH SỬA THÔNG TIN</h3>
                    <button className="modal-close"><i className="fa-regular fa-xmark"></i></button>
                    <div className="form-content sign-up">
                        <form action="" className="signup-form">
                            <div className="form-group">
                                <label htmlFor="fullname" className="form-label">Tên đầy đủ</label>
                                <input id="fullname" name="fullname" type="text" placeholder="VD: Nhật Sinh" className="form-control" />
                                <span className="form-message-name form-message"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                <input id="phone" name="phone" type="text" placeholder="Nhập số điện thoại" className="form-control" />
                                <span className="form-message-phone form-message"></span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Mật khẩu</label>
                                <input id="password" name="password" type="text" placeholder="Nhập mật khẩu" className="form-control" />
                                <span className="form-message-password form-message"></span>
                            </div>
                            <div className="form-group edit-account-e">
                                <label htmlFor="user-status" className="form-label">Trạng thái</label>
                                <input type="checkbox" id="user-status" className="switch-input" />
                                <label htmlFor="user-status" className="switch"></label>
                            </div>
                            <button className="form-submit add-account-e" id="signup-button" type="submit">Đăng ký</button>
                            <button className="form-submit edit-account-e" id="btn-update-account" type="submit"><i className="fa-regular fa-floppy-disk"></i> Lưu thông tin</button>
                        </form>
                    </div>
                </div>
            </div>
            <div id="toast"></div>
        </div>
    );
};

export default AdminPage;

