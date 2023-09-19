import React, {useEffect, useState} from "react";
import HeaderPage from "../header/header";
import "./myPage.css";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import MyLendListPage from "./myLendList";
import MyBorrowListPage from "./myBorrowList";
import MyBasketListPage from "./myBasketList";
import MyItemReview from "./myItemReview";
import {UploadOutlined} from "@ant-design/icons";
import {Button, Card, Divider, Space, Upload} from "antd";

function MyPage () {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [name, setName] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [email, setEmail] = useState('');
    const [trustPoint, setTrustPoint] = useState(0);
    const [ready, setReady] = useState(0);
    const [isSelect0, setIsSelect0] = useState(true);
    const [isSelect1, setIsSelect1] = useState(false);
    const [isSelect2, setIsSelect2] = useState(false);
    const [isSelect3, setIsSelect3] = useState(false);

    const tabHandler = (index) => {
        setTabIndex(index);
    }


    const getClientInfo = () => {
        axios.get("clients/me", {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            }
        }).then(response => {
            sessionStorage.setItem('client_index', response.data.data.clientIndex)
            console.log(response.data.data)
            setEmail(response.data.data.email)
            setTrustPoint(response.data.data.trustPoint)
            setName(response.data.data.clientName)
            setPhoneNum(response.data.data.phoneNumber)
            console.log(response.data.data.trustPoint)
            setImageList(response.data.data.clientPhoto)
        })
            .catch(error => {
                console.log(error.response.data);
            })
    }


    const nickNameHandler = () => {
        if(ready === 0) {
            setReady(1)
        } else {
            setReady(0)

        }

    }

    const onSubmit = () => {
        const clientIndex = sessionStorage.getItem('client_index');
        console.log(clientIndex)
        const option = {
            url : "/clients/"+clientIndex+"/nickname",
            method: 'PUT',
            header: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token")
            },
            data: 'nickname=' + userNick
        }

        axios(option)
            .then(res=>{
                if (res.status >= 200 && res.status <= 204) {
                    setReady(0)
                    dispatch({type: "NICKNAME", payload: userNick})
                    console.log(res.data.message);
                }
            }).catch(res=>{
            setReady(1)
            alert(res.response.data.message);
        });
    };

    const nickName = useSelector(state => state.nickName);
    const [userNick, setUserNick] = useState(nickName);

    const nickNameChange = (e) => {
        console.log(userNick)
        setUserNick(e.target.value)
    }
    const onProfileChange = () => {

        const formData = new FormData();
        imageAntList.forEach(image => formData.append("clientPhoto", image.originFileObj))

        const option = {
            url : '/clients/client-photo',
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token"),

            },
            data: formData

        }

        axios(option)
            .then(res=>{
                console.log(res.data);
                setImageAntList([])
                getClientInfo();

            }).catch(res=>{
            alert("대표사진을 올려주세요.");
        });
    };

    const TapContent = [
        {
            myTitle:(
                <li className={isSelect0 ? "tabTitle1_Active" : "tabTitle1" }
                    onClick={()=> {
                    tabHandler(0)
                    setIsSelect0(true)
                    setIsSelect1(false)
                    setIsSelect2(false)
                    setIsSelect3(false)}}>내가 올린 물품 보기</li>
            ),
            myContent:(
                <div>
                <MyLendListPage/>
                </div>
            )
        },
        {
            myTitle:(
                <li className={isSelect1 ? "tabTitle_Active" : "tabTitle" }
                    onClick={()=> {
                    tabHandler(1)
                    setIsSelect0(false)
                    setIsSelect1(true)
                    setIsSelect2(false)
                    setIsSelect3(false)}}>내가 빌린 물품 보기</li>
            ),
            myContent:(
                <div><MyBorrowListPage/></div>
            )
        },
        {
            myTitle:(
                <li className={isSelect2 ? "tabTitle_Active" : "tabTitle" }
                    onClick={()=> {
                    tabHandler(2)
                    setIsSelect0(false)
                    setIsSelect1(false)
                    setIsSelect2(true)
                    setIsSelect3(false)}}>내 찜 목록 보기</li>
            ),
            myContent:(
                <div><MyBasketListPage/></div>
            )
        },
        {
            myTitle:(
                <li className={isSelect3 ? "tabTitle_Active" : "tabTitle" }
                    onClick={()=> {
                    tabHandler(3)
                    setIsSelect0(false)
                    setIsSelect1(false)
                    setIsSelect2(false)
                    setIsSelect3(true)}}>내 후기 보기</li>
            ),
            myContent:(
                <div><MyItemReview/></div>
            )
        }
    ]


    useEffect(() => {
        getClientInfo()
        },[])
    const [imageList, setImageList] = useState('');
    const [imageAntList, setImageAntList] = useState([]);

    const onPictureChange = ({ fileList: newFileList }) => { setImageAntList(newFileList); };
    return(
        <div>
            <title></title>
            <header>
                <HeaderPage></HeaderPage>
            </header>
            <Divider></Divider>
            <div>
                <p className="pageTitle">{nickName} 님의 페이지</p>
            </div>
            <div className = "myPageWrap">
                <Card className="userCard">
                <div className = "user">
                    <div className = "left">
                        <img className= "userPhoto" src={imageList}/>
                        <Space
                            direction="vertical"
                            style={{
                                width: '100%',
                            }}
                            size="large"
                        >
                            <Upload
                                listType="picture"
                                fileList={imageAntList}
                                onChange={onPictureChange}
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button  type="primary" ghost className="imgBtn" icon={<UploadOutlined />}>대표사진 수정</Button>
                            </Upload>
                            <Button type="primary" ghost className="imgOkBtn" onClick={onProfileChange}>
                                확인
                            </Button>
                        </Space>

                    </div>


                    <div className="userContent">
                        <div className="userName">이름 : {name}</div>
                        {ready === 0 ?
                        <div className="usersNick">
                            닉네임 : {nickName}
                        <Button ghost type="primary" className="nickNameChangeBtn" onClick= {nickNameHandler}>닉네임 수정</Button>

                        </div>

                            :
                        <div className="usersNick">
                            <input type="text" maxLength="40" onChange={nickNameChange} value={userNick} />
                        <Button type="primary" ghost className="nickNameChangeBtn" onClick={() => {
                            onSubmit()}}>수정</Button>
                        </div>
                            }

                        <div className="userEmail">이메일: {email}</div>

                        <div className="userPhoneNum">휴대번호 : {phoneNum}</div>

                        {trustPoint == null ?
                            <div>사용자 평점 : 받은 평점이 없습니다</div>
                                :
                            <div>사용자 평점 : {trustPoint}</div>
                            }
                    </div>

                </div>
                </Card>
                <Divider></Divider>
                <div>
                    <Card>
                    <ul className = "tab">
                        {TapContent.map((section)=>{
                            return section.myTitle
                            })}
                    </ul>

                    <div className = "tabCont">
                        <div className = "tabContDetail">
                        {TapContent[tabIndex].myContent}
                        </div>
                    </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
export default MyPage;