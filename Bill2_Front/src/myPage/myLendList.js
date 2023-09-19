import React, {Fragment, useEffect, useState} from "react";
import "./myLendList.css";
import {Link, useNavigate} from "react-router-dom";
import {Card, Col, Row, Avatar, Button, Badge} from 'antd';
import { HeartOutlined,HeartFilled, BorderOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import axios from "axios";
import moment from "moment";
import ProductViewDetailsPage from "../productViewDetails/productViewDetails";
import {useSelector, useDispatch, batch} from "react-redux";

function MyLendListPage() {

    // const latitude = useSelector(state=> state.latitude)
    // const longitude = useSelector(state=> state.longitude)

    let [page, setPage] = useState(0);
    const [last, setLast] = useState(false);
    const [myLendingItemList, setMyLendingItemList] = useState([]);
    // const [createDate, setCreateDate] = useState([moment().format('YYYY 년 MM월 DD일 HH시')]);

    const navigate = useNavigate();


    const toProductViewDetailsPage = (itemId) => {
        navigate("/ProductViewDetails" , {state : itemId});
    }
    const increasePage = () => {
        setPage(++page);

        onLending()
    };

    useEffect(() => {
        onLending()

    }, []);

    const onLending = () => {
        axios.get( '/items/me?page='+page,
            {headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}
            ,
        )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    console.log(response.data.data)

                    setMyLendingItemList(response.data.data.content);
                    setLast(response.data.data.last);





                }
            })
            .catch(res => {

            })

    };


    // const addBasket = (itemId,isLike) => { //찜하기가 안된상태에서 찜하기를 눌렀을때
    //
    //     axios.post("http://localhost:8080/baskets?itemId="+itemId,
    //         {},{headers: {
    //                 Authorization: 'Bearer ' + sessionStorage.getItem("token")
    //             }}
    //
    //
    //     ).then(response => {
    //         onSubmit(latitude, longitude);
    //     })
    //         .catch(error => {
    //             console.log(error.response);
    //         })
    // }
    //
    // const delBasket = (itemId,isLike) => { //찜하기가 안된상태에서 찜하기를 눌렀을때
    //
    //     axios.delete("http://localhost:8080/baskets?itemId="+itemId,
    //         {headers: {
    //                 Authorization: 'Bearer ' + sessionStorage.getItem("token")
    //             }}
    //
    //
    //     ).then(response => {
    //         onSubmit(latitude, longitude);
    //     })
    //         .catch(error => {
    //             console.log(error.response);
    //         })
    // }
    function format  (date) {

        return date.getFullYear() + "년 " + (("00"+(date.getMonth() + 1))).slice(-2) + "월 " + (("00"+date.getDate()).slice(-2)) + "일 " + date.getHours() + "시" ;

    }


    return (
        <Fragment>

            <div className="row">

                <Row  gutter={24}>

                    {myLendingItemList.map(lendingitem => {


                        return (

                            <Col span={4.5} className="col">
                                <Card  hoverable
                                       key={lendingitem.itemId} className="cards">


                                    <span> <h2 className="title"
                                               onClick={ () => {toProductViewDetailsPage(lendingitem.itemId) }}>
                                        제목: {lendingitem.itemTitle}</h2>

                                        {lendingitem.contractStatus === "0" ?
                                            <p ></p> :
                                            lendingitem.contractStatus === "2" ?
                                                <p className="rental">대여중</p> :
                                                <p className="reservation">예약중</p>}</span>
                                    <p>게시일: {format(new Date(lendingitem.createDate))}</p>
                                    <p>대여료: {lendingitem.price}</p>
                                    <p>보증금: {lendingitem.deposit}</p>
                                    <p>아이템 위치: {lendingitem.itemAddress}</p>
                                    {/*<p>대여상태: {item.contractStatus}</p>*/}

                                    <img className="phoneImage" src={lendingitem.itemPhoto}/>


                                </Card>
                            </Col>
                        )
                    })}
                </Row>

            </div>
            {last === true?
                <Button className="moreButton" disabled>더보기</Button>:
                <Button className="moreButton" onClick={increasePage}>더보기</Button>
            }



        </Fragment>

    )


}
export default MyLendListPage;

