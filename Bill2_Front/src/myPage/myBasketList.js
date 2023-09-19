import React, { Fragment, useEffect, useState } from "react";
import "./myBorrowList.css";
import { Link, useNavigate } from "react-router-dom";
import { Card, Col, Row, Button } from 'antd';
import axios from "axios";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

function MyBasketListPage() {


    let [page, setPage] = useState(0);
    const [last, setLast] = useState(false);
    const [myBasketItemList, setMyBasketItemList] = useState([]);
    const [] = useState(0);

    const navigate = useNavigate();


    const toProductViewDetailsPage = (itemId) => {
        navigate("/ProductViewDetails", { state: itemId });
    }
    const increasePage = () => {
        setPage(++page);

        onLendingBaskets()
    };

    useEffect(() => {
        onLendingBaskets()
    }, []);

    const onLendingBaskets = () => {
        axios.get('/baskets/me?page=' + page,
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            }
            ,
        )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    setMyBasketItemList(response.data.data.content);
                    setLast(response.data.data.last);
                }
            })
            .catch(res => {

            })

    };

    const delBasket = (itemId) => { //찜하기가 안된상태에서 찜하기를 눌렀을때

        axios.delete("/baskets?itemId=" + itemId,
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            }

        ).then(response => {
            onLendingBaskets()
        })
            .catch(error => {
                console.log(error.response);
            })
    }

    function format(date) {
        return date.getFullYear() + "년 " + (("00" + (date.getMonth() + 1))).slice(-2) + "월 " + (("00" + date.getDate()).slice(-2)) + "일 " + date.getHours() + "시";
    }

    return (
        <Fragment>

            <div className="row">

                <Row gutter={24}>

                    {myBasketItemList.map((basketItem) => {

                        return (

                            <Col span={4.5} className="col">
                                <Card hoverable
                                    key={basketItem.itemId} className="cards">
                                    <HeartFilled onClick={() => { delBasket(basketItem.itemId) }}></HeartFilled>

                                    <span>
                                        <h2 className="title"
                                            onClick={() => { toProductViewDetailsPage(basketItem.itemId) }}
                                        >
                                            제목: {basketItem.itemTitle}</h2>

                                        {basketItem.contractStatus === "0" ?
                                            <p ></p> :
                                            basketItem.contractStatus === "2" ?
                                                <p className="rental">대여중</p> :
                                                <p className="reservation">예약중</p>}</span>

                                    <p>게시일: {format(new Date(basketItem.createDate))}</p>
                                    <p>대여료: {basketItem.price}</p>
                                    <p>보증금: {basketItem.deposit}</p>
                                    <p>아이템 위치: {basketItem.itemAddress}</p>
                                    {/*<p>대여상태: {item.contractStatus}</p>*/}

                                    <img className="phoneImage" src={basketItem.itemPhoto} />


                                </Card>
                            </Col>
                        )
                    })}
                </Row>

            </div>
            {last === true ?
                <Button className="moreButton" disabled>더보기</Button> :
                <Button className="moreButton" onClick={increasePage}>더보기</Button>
            }



        </Fragment>

    )


}
export default MyBasketListPage;

