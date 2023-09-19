import MainPage from "./Main/Main"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./login/login";
import SignUpPage from "./signUp/signUp";
import SnsSignUpPage from "./signUp/snsSignUp";
import WritePage from "./write/write";
import ProductViewDetailsPage from "./productViewDetails/productViewDetails";
import SearchPage from "./search/search";
import CategorySearchPage from "./categorySearch/categorySearch";
import MyPage from "./myPage/myPage";
import ChatPage from "./chat/chat"
import BillyPayPage from "./billyPay/billyPay";
import Loader from "./billyPay/loadingBillyPay";
import BlankPage from "./billyPay/blanck";
import AmendWritePage from "./write/amendWrite";

function Routers() {
    return (
        //라우터 설정
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/snsSignUp" element={<SnsSignUpPage />} />
                    <Route path="/signUp" element={<SignUpPage />} />
                    <Route path="/write" element={<WritePage />} />
                    <Route path="/productViewDetails" element={<ProductViewDetailsPage />} />
                    <Route path="/categorySearch" element={<CategorySearchPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/MyPage" element={<MyPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/billyPay" element={<BillyPayPage />} />
                    <Route path="/loading" element={<Loader />} />
                    <Route path="/blank" element={<BlankPage />} />
                    <Route path="/amendWrite" element={<AmendWritePage />} />

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Routers;