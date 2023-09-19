import {Form, Input, Button, Checkbox, Divider, Card} from 'antd';  //ant design form 사용
import { UserOutlined, LockOutlined } from '@ant-design/icons';  //터미널에서 npm install antd 입력 후 설치
import "./login.css";
import {Link, useLocation, useNavigate} from "react-router-dom"
import React, {useEffect,} from "react";
import axios from "axios";


function LoginPage () {
    const location = useLocation();
    const navigate = useNavigate();

    const onSubmit = (values) => {
        const data = {
            clientId    : values.id,
            password    : values.password
        }

        const option = {
            url : 'auth/login',
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: data
        }

        axios(option)
            .then(res=>{
                sessionStorage.setItem('token', res.data.data);
                navigate('/Main/Main');
            }).catch(res=>{
            alert(res.response.data.message);
        });
    };



    const onSubmitFailed = (errorInfo) => {  //exception 발생 시 에러 원인 불러오기
        console.log("로그인에 실패했습니다",errorInfo);  //서버로 요청하는 값
    };

    const initializeNaverLogin = () => {
        if (!location.hash){
            const naverLogin = new window.naver.LoginWithNaverId({
                clientId: "7uNJD1fpryntJskxi0Z1",
                callbackUrl: "https://bill2market.com/login",
                isPopup: false,
                loginButton: { color: 'green', type: 3, height: '47' },
            });
            naverLogin.init();
        }else{
            const token = location.hash.split('=')[1].split('&')[0];


            let option = {
                url : '/auth/naver-login',
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: "access_token=" + token
            }

            axios(option)
                .then(res=>{

                    if (!res.data.success || res.data.code == 1) { //  닉네임 입력 필요
                        sessionStorage.setItem('client_index', res.data.clientIndex)
                        navigate("/SnsSignUp")

                    } else { // 로그인 성공

                        sessionStorage.setItem('client_index', res.data.clientIndex)
                        sessionStorage.setItem('token', res.data.token);
                        console.log(sessionStorage.getItem('client_index'));
                        navigate("/Main")


                        }

                }).catch(res=>{
                alert(res.response.data.message);
            });
        }
    };



    useEffect(() => {
        initializeNaverLogin();
    }, []);



    return (

        <div className = "login_container">

            <Card className="loginCard">
                <Link className='homePage_Link' to={'/main'}>
                    메인페이지로 돌아가기
                </Link>
            <Form
                name = "login"
                onFinish={onSubmit}  //콜백함수 구현 , 값 받아서 values에 넣음
                onFinishFailed={onSubmitFailed} //
                autoComplete="off"   //자동완성 끄기
                initialValues={{
                    remember: true,  //아이디 기억할 때 값 기억하는 거
                }}
            >

                <h1 className="loginTitle">로그인</h1>
                <p>신규 회원이신가요?  &nbsp;
                    <Link className='signUp_Link' to={'/signUp'}>
                        빌리마켓 회원가입하기
                    </Link>
                </p>
                {/* 회원가입 화면 구현하면 링크 넣을 예정 */}

                <Form.Item
                    name ="id" //values에 들어갈 key 값
                    rules = {[{required :true, message : "아이디를 입력해주세요!"},]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />} //아이디 입력창 옆 아이콘
                        placeholder="아이디를 입력하세요." />

                </Form.Item>


                <Form.Item
                    name ="password"  //values에 들어갈 key 값
                    rules = {[{required :true, message : "비밀번호를 입력해주세요!"},]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />} //비밀번호 입력창 옆 아이콘
                        type="password"
                        placeholder="비밀번호를 입력하세요."/>
                </Form.Item>


                <Form.Item>
                        <Button type="primary" ghost htmlType="submit" className='login_button'>
                            로그인
                        </Button>
                </Form.Item>
                {/* 로그인 버튼 구현 */}

                <Divider>
                </Divider>
                {/* 보기 쉽게 구분선 구현 */}

                <div className='sns_login'>


                    <div id='naverIdLogin'>
                    </div>


                </div>

                <Divider>
                </Divider>
                {/* 보기 쉽게 구분선 구현 */}

                <div className='underbar'>

                    {/* <Link className='findId_Link' to={'/findIdPage'}> */}
                    <Link to="">아이디찾기</Link>  &nbsp;
                    {/* </Link> */}

                    {/* <Link className='findPassword_Link' to={'/findPasswordPage'}> */}
                    <Link to="">비밀번호찾기</Link>  &nbsp;
                    {/* </Link> */}

                    <Link className='signUp_Link' to={'/signup'}>
                        회원가입
                    </Link>

                </div>

            </Form>
            </Card>

        </div>

    )
}

export default LoginPage;
