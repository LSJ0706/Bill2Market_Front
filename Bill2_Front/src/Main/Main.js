import React, {Fragment, useEffect, useState} from "react";
import "./Main.css";
import HeaderPage from "../header/header";
import ProductListPage from "../productList/productList";
import {shallowEqual, useSelector} from "react-redux";
import CategorySearchPage from "../categorySearch/categorySearch";

function MainPage()  {
    const value = useSelector(state => state.value, shallowEqual)
    const [test1,setTest1] = useState('')

    // useEffect(() => {
    //
    //    setTest1(value)
    //
    //
    //
    // }, []);

    return (
        <Fragment>

            <title>빌리마켓</title>
            <body>
        <header>
            <HeaderPage></HeaderPage>

        </header>

        <main>
            <h3>물품 보여주기</h3>
            {JSON.stringify(value) === JSON.stringify([])?
                <ProductListPage></ProductListPage>
            :

                <CategorySearchPage></CategorySearchPage>

            }

        </main>

      </body>

    </Fragment>
    )
}

export default MainPage;