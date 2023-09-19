import React, {Fragment, useEffect, useState} from "react";
import "./myBorrowList.css";
import {Link, useNavigate} from "react-router-dom";
import {Card, Col, Row, Avatar, Button, Badge, Modal, Input, Form, Rate} from 'antd';
import { HeartOutlined,HeartFilled, BorderOutlined } from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import axios from "axios";
import moment from "moment";
import ProductViewDetailsPage from "../productViewDetails/productViewDetails";
import {useSelector, useDispatch, batch} from "react-redux";
import {FormInstance} from "antd";



function MyBorrowListPage() {


    // const latitude = useSelector(state=> state.latitude)
    // const longitude = useSelector(state=> state.longitude)

    let [page, setPage] = useState(0);
    const [last, setLast] = useState(false);
    const [myBorrowItemList, setMyBorrowItemList] = useState([]);
    // const [createDate, setCreateDate] = useState([moment().format('YYYY 년 MM월 DD일 HH시')]);
    const [currentIndex, setCurrentIndex] = useState(0);

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
        axios.get( '/contracts/me?page='+page,
            {headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }}
            ,
        )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    console.log(response.data.data)

                    setMyBorrowItemList(response.data.data.content);
                    setLast(response.data.data.last);





                }
            })
            .catch(res => {

            })

    };




    function format  (date) {

        return date.getFullYear() + "년 " + (("00"+(date.getMonth() + 1))).slice(-2) + "월 " + (("00"+date.getDate()).slice(-2)) + "일 " + date.getHours() + "시" ;

    }
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (index) => {
        setIsModalVisible(true);
        setCurrentIndex(index);
        console.log(currentIndex);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        onLending();

    };

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed: 내용을 입력해주세요', errorInfo);
    };
    const [form] = Form.useForm();
    const onReset = () => {
        form.resetFields();
        setReviewScoreReset(reviewScore);
    };

    const [reviewId, setReviewId] = useState();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [reviewScore, setReviewScore] = useState(3);
    const setTitleChange = (e) => { setTitle(e.target.value); };
    const setContentChange = (e) => { setContent(e.target.value); };

    function setReviewScoreChange (reviewScore){
        setReviewScore(reviewScore);
    }
    function setReviewScoreReset (reviewScore){
        setReviewScore(3);
    }

    const onSubmit = (index) => {

        const data = {
            "itemId": myBorrowItemList[index].itemId,
            "reviewContent": content,
            "reviewScore": reviewScore,
            "reviewTitle": title

        }
        const option = {
            url : '/items/review',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token"),
            },
            data: data

        }

        axios(option)
            .then(res=>{
                console.log(res.data);
                alert("리뷰 작성이 완료되었습니다.")
                setIsModalVisible(false);
                onLending();

            }).catch(res=>{

                alert(res.response.data.message);





        });

    };
    console.log(reviewScore)

    return (
        <Fragment>

            <div className="row">

                <Row  gutter={24}>

                    {myBorrowItemList.map((borrowitem, index) => {


                        return (

                            <Col span={4.5} className="col">
                                <Card  hoverable
                                       key={borrowitem.itemId} className="cards">


                                    <span> <h2 className="title"
                                               onClick={ () => {toProductViewDetailsPage(borrowitem.itemId) }}>
                                        제목: {borrowitem.itemTitle}</h2>

                                        {borrowitem.contractStatus === "0" ?
                                            <p className="apply">요청중</p>:
                                            borrowitem.contractStatus === "1" ?
                                                <p className="rental">거래중</p>:
                                                borrowitem.contractStatus === "2" ?
                                                    <p className="expire">계약기간만료</p>:
                                                <p className="done">계약종료</p>}</span>
                                    <p>대여일: {format(new Date(borrowitem.startDate))}</p>
                                    <p>대여료: {borrowitem.price}</p>
                                    <p>보증금: {borrowitem.deposit}</p>
                                    <p>아이템 위치: {borrowitem.itemAddress}</p>
                                    {/*<p>대여상태: {item.contractStatus}</p>*/}

                                    <img className="phoneImage" src={borrowitem.itemPhoto}/>
                                    {borrowitem.reviewWrite === 0?
                                        <Button className="modalButton" onClick={() =>{showModal(index)}}>
                                            리뷰 작성하기
                                        </Button>
                                        :
                                        <Button className="modalButton" disabled> 리뷰 작성완료</Button>
                                    }




                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <Modal
                    title="리뷰 작성하기"
                    visible={isModalVisible}
                    // onOk={handleOk}
                    onCancel={() => {handleCancel()
                        onReset()}}
                    footer={[
                        <Button onClick={() => {handleCancel()
                            onReset()}}>취소</Button>,
                        <Button onClick={(myBorrowItemList.length==0)?
                                null:
                                () => {onSubmit(currentIndex)}}>
                                등록
                            </Button>

                    ]}>


                    <Card  className="itemReviewCard">
                        <row>
                            <div className="reviewImage">
                                <img className="reviewphoneImage" src={
                                    (myBorrowItemList.length==0)?
                                        "":
                                    myBorrowItemList[currentIndex].itemPhoto}/>
                            </div>
                            <div className="reviewText">
                                <h2 className="title">제목: {
                                    (myBorrowItemList.length==0)?
                                        ""
                                        : myBorrowItemList[currentIndex].itemTitle

                                }</h2>
                                <p>대여일: {(myBorrowItemList.length==0)?
                                    "":
                                    format(new Date(myBorrowItemList[currentIndex].startDate))}</p>
                                <p>대여료: {(myBorrowItemList.length==0)?
                                    "" :
                                    myBorrowItemList[currentIndex].price}</p>
                                <p>보증금: {(myBorrowItemList.length==0)?
                                    "" :
                                    myBorrowItemList[currentIndex].deposit}</p>
                            </div>
                        </row>

                    </Card>
                    <p className="scoreText">별점을 남겨주세요!</p>

                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        // initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Rate className="scoreStar" onChange={setReviewScoreChange} value={reviewScore}/>
                        <Card className="reviewCard">
                            <Form.Item
                                className="reviewTitle"
                                name = "reviewTitle"
                                rules={[{required: true, message: '제목을 입력해주세요!'}]}>

                                <Input.TextArea
                                    rows={5}
                                    placeholder="제목"
                                    size="small"
                                    showCount
                                    maxLength={30}
                                    onChange={setTitleChange}
                                />
                            </Form.Item>
                            <Form.Item
                                className="reviewContent"
                                name = "reviewContent"
                                rules={[{required: true, message: '내용을 입력해주세요!'}]}>

                                <Input.TextArea
                                    rows={5}
                                    placeholder="리뷰를 작성해주세요"
                                    size="large"
                                    showCount
                                    maxLength={1000}
                                    onChange={setContentChange}
                                />
                            </Form.Item>
                        </Card>
                    </Form>
                </Modal>
            </div>
            {last === true?
                <Button className="moreButton" disabled>더보기</Button>:
                <Button className="moreButton" onClick={increasePage}>더보기</Button>
            }



        </Fragment>

    )


}
export default MyBorrowListPage;

