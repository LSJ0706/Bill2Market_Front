import React, {Fragment, useEffect, useMemo, useState, useRef} from "react";
import "./productList.css";
import {Link, useNavigate} from "react-router-dom";
import {Card, Col, Row, Avatar, Button, Badge} from 'antd';
import { HeartOutlined,HeartFilled, BorderOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import axios from "axios";
import moment from "moment";
import ProductViewDetailsPage from "../productViewDetails/productViewDetails";
import {useSelector, useDispatch, batch} from "react-redux";

function ProductListPage() {
    const dispatchLocation = useDispatch();
    let [latitude, setLatitude] = useState(0);
    let [longitude, setLongitude] = useState(0);

    let [page, setPage] = useState(0);
    const [last, setLast] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [itemMap, setItemMap] = useState(new Map());
    // const [createDate, setCreateDate] = useState([moment().format('YYYY 년 MM월 DD일 HH시')]);

    const navigate = useNavigate();


    const toProductViewDetailsPage = (itemId) => {
        navigate("/ProductViewDetails" , {state : itemId});
        }
    const increasePage = () => {
        setPage(++page);

        addSubmit(latitude, longitude)
    };

    useEffect(() => {

        if (navigator.geolocation) { // GPS를 지원하면 사용자 local에서 위도 경도 불러오는 부분
            navigator.geolocation.getCurrentPosition(function (position) {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);

                addSubmit(position.coords.latitude, position.coords.longitude)


            }, function (error) {
                console.error(error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: Infinity
            });
        } else {
            alert('GPS를 지원하지 않습니다');
        }

        }, []);
    //itemMpa의 value에 따른 array를 itemList에 넣는 부분
    useEffect(() => {
        setItemList([...itemMap.values()])

    },[itemMap])

    //더보기 함수
    const onSubmit = (latitude, longitude, index) => {

        axios.get( '/items?latitude='+latitude+'&longitude='+longitude+'&page='+index ,
            {headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}
            ,
        )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    console.log(response.data.data.pageable.pageNumber)

                    setItemMap((prev)=>new Map(prev).set(index,response.data.data.content))
                    setLast(response.data.data.last);


                    // batch(() => {
                        dispatchLocation({type: "LATITUDE", payload: latitude})
                        dispatchLocation({type: "LONGITUDE", payload: longitude})


                    // })


                }
            })
            .catch(res => {

            })


    };

        //물품리스트 불러올때 사용되는 함수
    const addSubmit = (latitude, longitude) => {
        axios.get( '/items?latitude='+latitude+'&longitude='+longitude+'&page='+page ,
            {headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}
            ,
        )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    console.log(response.data.data.pageable.pageNumber)

                    setItemMap((prev)=>new Map([...prev,[page,response.data.data.content]]))
                    setLast(response.data.data.last);


                    // batch(() => {
                    dispatchLocation({type: "LATITUDE", payload: latitude})
                    dispatchLocation({type: "LONGITUDE", payload: longitude})


                    // })


                }
            })
            .catch(res => {

            })

    };
    //찜하기
    const addBasket = (itemId,index) => { //찜하기가 안된상태에서 찜하기를 눌렀을때

        axios.post("/baskets?itemId="+itemId,
            {},{headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}


        ).then(response => {
            onSubmit(latitude, longitude, index);

        })
            .catch(error => {
                console.log(error.response);
            })
    }

    const delBasket = (itemId,index) => { //찜하기가 안된상태에서 찜하기를 눌렀을때

        axios.delete("/baskets?itemId="+itemId,
            {headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}


        ).then(response => {
            onSubmit(latitude, longitude, index);
        })
            .catch(error => {
                console.log(error.response);
            })
    }
    function format  (date) {

        return date.getFullYear() + "년 " + (("00"+(date.getMonth() + 1))).slice(-2) + "월 " + (("00"+date.getDate()).slice(-2)) + "일 " + date.getHours() + "시" ;

    }


    return (
        <Fragment>

            <div className="row">

                <Row  gutter={24}>
                    {itemList.map((list,index)=>

                    {
                        return(
                        list.map((item) => {


                        return (

                            <Col span={4.5} className="col">
                                <Card  hoverable
                                       key={item.itemId} className="cards">

                                    {item.isLike?

                                        <HeartFilled onClick ={()=>{delBasket(item.itemId,index)}}>

                                        </HeartFilled> :

                                        <HeartOutlined onClick ={()=>addBasket(item.itemId,index)}>

                                        </HeartOutlined>
                                    }


                                    <span> <h2 className="title"
                                               onClick={ () => {toProductViewDetailsPage(item.itemId) }}>
                                        제목: {item.itemTitle}</h2>

                                        {item.contractStatus === "0" ?
                                            <p ></p>:
                                            item.contractStatus === "2" ?
                                                <p className="rental">대여중</p>:
                                                <p className="reservation">예약중</p>}</span>
                                    <p>게시일: {format(new Date(item.createDate))}</p>
                                    <p>대여료: {item.price}</p>
                                    <p>보증금: {item.deposit}</p>
                                    <p>아이템 위치: {item.itemAddress}</p>
                                    {/*<p>대여상태: {item.contractStatus}</p>*/}

                                    <img className="phoneImage" src={item.itemPhoto}/>


                                </Card>
                            </Col>
                        )
                    }))})}
                </Row>

            </div>
            {last === true?
            <Button className="moreButton" disabled>더보기</Button>:
            <Button className="moreButton" onClick={increasePage}>더보기</Button>
            }



        </Fragment>

    )
}
export default ProductListPage;

