import React, {Fragment, useEffect, useState} from "react";
import "./myItemReview.css";
import {Link, useNavigate} from "react-router-dom";
import {Card, Col, Row, Avatar, Button, Badge, Rate} from 'antd';
import { HeartOutlined,HeartFilled, BorderOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import axios from "axios";
import moment from "moment";
import ProductViewDetailsPage from "../productViewDetails/productViewDetails";
import {useSelector, useDispatch, batch} from "react-redux";

function MyItemReview() {

    // const latitude = useSelector(state=> state.latitude)
    // const longitude = useSelector(state=> state.longitude)

    let [page, setPage] = useState(0);
    const [last, setLast] = useState(false);
    const [myitemReviewList, setMyitemReviewList] = useState([]);
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
        axios.get( '/clients/item-review?page='+page,
            {headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}
            ,
        )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    console.log(response.data.data)

                    setMyitemReviewList(response.data.data.content);
                    setLast(response.data.data.last);





                }
            })
            .catch(res => {

            })

    };



    function format  (date) {

        return date.getFullYear() + "년 " + (("00"+(date.getMonth() + 1))).slice(-2) + "월 " + (("00"+date.getDate()).slice(-2)) + "일 " + date.getHours() + "시" ;

    }


    return (
        <Fragment>

            <div className="row">

                <Row  gutter={24}>

                    {myitemReviewList.map(reviewItem => {


                        return (

                            <Col span={4.5} className="col">
                                <Card  hoverable
                                       key={reviewItem.itemId} className="cards">


                                    <span>
                                        <h2>리뷰 제목 : {reviewItem.reviewTitle}</h2>
                                        <p className="title"
                                           onClick={ () => {toProductViewDetailsPage(reviewItem.itemId) }}>
                                        제품: {reviewItem.itemTitle}</p>
                                    </span>
                                    <p>게시일: {format(new Date(reviewItem.createDate))}</p>
                                    <Rate className="rate" disabled defaultValue={reviewItem.reviewScore} />
                                    <p>작성자 : {reviewItem.writer}</p>

                                    <h2>리뷰 내용</h2>
                                    <p>{reviewItem.reviewContent}</p>





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
export default MyItemReview;

