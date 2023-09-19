import React , {useState} from "react";
import {Form, Input, Button, Divider, Tag} from 'antd';
import "./signUp.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";






function SnsSignUpPage () {



    const navigate = useNavigate();

    // const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [disable_nickname, setDisable_nickname] = useState(true);


    //Handler 구현    //받아온 값 전달
    const onNickNameHandler = (event) => {
        setNickname(event.currentTarget.value)
    }


    const onSubmitHandler = (event) => {
        event.preventDefault();

    }


    //axios 사용
    const onSubmit = (values) => {
        const data = {


        }
        const clientIndex = sessionStorage.getItem('client_index');
        const option = {
            url : "/clients/"+clientIndex+"/nickname",
            method: 'PUT',
            header: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            data: 'nickname=' + values.nickname
        }

        axios(option)
            .then(res=>{
                if (res.status >= 200 && res.status <= 204) {
                alert('닉네임 설정이 완료되었습니다. ^____^');
                navigate("/Main")
                }
            }).catch(res=>{
            alert(res.response.data.message);
            console.log(res.response.data.message);
        });
    };


    const snsNickNameCheck = () => {
        axios.get("/clients/nickname-check?nickname=" + nickname )
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    alert('사용가능한 닉네임 입니다!');
                    console.log(nickname + "")
                }
            })
            .catch(res => {
                alert(res.response.data.message);
            })

    };


    const isSnsSignUp = () => {
        if (disable_nickname === false) {
            return  false;
        }
        else {
            return  true;
        }


    }










    return (
            <div className = "snsSignup_container">
            <Form
                title ="닉네임 등록하기"
                onFinish={onSubmit}  //콜백함수 구현 , 값 받아서 values에 넣음
                onSubmit={onSubmitHandler}

            >
                <h1 className="snsSignUp_Header">sns 로그인 닉네임 설정</h1>

                <Divider></Divider>


                <Button className = "nicknameCheck_Button"  onClick={ () => {snsNickNameCheck()
                    setDisable_nickname(false)}}>
                    닉네임 중복 확인</Button>


                <Form.Item

                    name = "nickname"
                    label="닉네임"
                    tooltip="빌리마켓에서 이름 대신 보여집니다. 멋진 닉네임을 지어보세요!"
                    rules = {[{    //입력이 안되면 메세지 뜨는 속성
                        required :true,
                        message : "닉네임을 입력해주세요!" },
                    ]}
                >
                    <Input value={nickname} onChange= {onNickNameHandler}/>

                </Form.Item>
                <Divider>

                </Divider>

                <Tag color="error" className='comment'> 닉네임 중복확인을 하면 회원가입 버튼이 활성화 됩니다.</Tag>

                <Button
                    type="primary" onSubmit={onSubmitHandler} disabled={isSnsSignUp()}
                    className="signUp_Button"  htmlType="submit">
                    회원가입하기
                </Button>


            </Form>

            </div>
        )


};


export default SnsSignUpPage;