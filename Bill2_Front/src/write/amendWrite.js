import {Form, Input, Button, DatePicker, Upload, Modal, Cascader, Card} from 'antd'
import React, {useEffect, useState} from "react"
import moment from "moment";
import "./write.css";
import HeaderPage from "../header/header";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import DaumPostCode from "react-daum-postcode";
import {TagsFilled, UploadOutlined} from "@ant-design/icons";
import {useNavigate, useLocation} from "react-router-dom";



function AmendWritePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const itemId = location.state


    const [form] = Form.useForm()

    const getItem = () => {
        axios.get("/items/"+itemId,
            {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
            .then (response => {

                const big = String(response.data.data.item.categoryBig)
                const middle = String(response.data.data.item.categoryMiddle)
                const small = String(response.data.data.item.categorySmall)
                let array = [];

                writeOptions.filter((e)=>{
                    if(e.value === big){
                        array.push(e.label)
                        e.children.filter((e)=>{
                            if(e.value === middle){
                                array.push(e.label)
                                e.children.filter((e)=>{
                                    if(e.value === small){
                                        array.push(e.label)
                                    }
                                })
                            }
                        })
                    }
                })

                form.setFieldsValue({
                    title: response.data.data.item.itemTitle,
                    content: response.data.data.item.itemContent,
                    price: response.data.data.item.price,
                    deposit: response.data.data.item.deposit,
                    cate : array,
                })

                let photos = response.data.data.item.photos;
                photos.map(photo => {
                    fetch(photo.itemPhoto)
                        .then(res => res.blob()) // Gets the response and returns it as a blob
                        .then(blob => {
                                const ext = photo.itemPhoto.split(".").pop(); // url 구조에 맞게 수정할 것
                                const filename = photo.itemPhoto.split("/").pop(); // url 구조에 맞게 수정할 것
                                const metadata = { type: "image/" + ext };
                                let data = new Object();
                                data.uid = photo.itemPhotoIndex;
                                data.status = "done";
                                data.url = photo.itemPhoto;
                                data.originFileObj = new File([blob], filename, metadata);
                                setImageList((prev) => [...prev, data])

                            }
                        );

                })

                setBig(response.data.data.item.categoryBig)
                setMiddle(response.data.data.item.categoryMiddle)
                setSmall(response.data.data.item.categorySmall)
                setTitle(response.data.data.item.itemTitle)
                setContent(response.data.data.item.itemContent)
                setPrice (response.data.data.item.price)
                setDeposit (response.data.data.item.deposit)
                setStartDate(moment(response.data.data.item.startDate))
                setEndDate(moment(response.data.data.item.endDate))
                console.log(response.data.data.item)
                setQuality(response.data.data.item.itemQuality)
                setAddress(response.data.data.item.itemAddress)
            })
    }

    //카테고리 설정
    const writeOptions = [
        {
            value: '1',
            label: '여가·스포츠',
            children: [
                {
                    value: '11', label: '오토바이·스쿠터',
                    children: [
                        {value: '111', label: '125cc 이하',},
                        {value: '112', label: '125cc 초과',},
                        {value: '113', label: '주변장비',}
                    ],

                },
                {
                    value: '12', label: '자전거',
                    children: [
                        {value: '121', label: 'MTB·산악',},
                        {value: '122', label: '로드',},
                        {value: '123', label: '클래식·픽시',},
                        {value: '124', label: '하이브리드',},
                        {value: '125', label: '기타',}

                    ],

                },
                {
                    value: '13', label: '캠핑·레저',
                    children: [
                        {value: '131', label: '텐트',},
                        {value: '132', label: '캠핑용품',},
                        {value: '133', label: '취사용품',},
                        {value: '134', label: '레저용품',},
                        {value: '135', label: '기타',}

                    ],

                },
                {
                    value: '14', label: '스포츠',
                    children: [
                        {value: '141', label: '축구',},
                        {value: '142', label: '농구',},
                        {value: '143', label: '야구',},
                        {value: '144', label: '배드민턴',},
                        {value: '145', label: '테니스',},
                        {value: '146', label: '기타',}

                    ],

                },
                {
                    value: '15', label: '기타',
                    children: [
                        {value: '151', label: '기타',}

                    ],

                },
            ],
        },
        {
            value: '2',
            label: '도서',
            children: [
                {
                    value: '21', label: '문학',
                    children: [
                        {value: '211', label: '소설',},
                        {value: '212', label: '라이트노벨',},
                        {value: '213', label: '시집',},
                        {value: '214', label: '에세이',},
                        {value: '215', label: '만화',},
                        {value: '216', label: '기타',},
                    ],

                },
                {
                    value: '22', label: '실용',
                    children: [
                        {value: '221', label: '경제·경영',},
                        {value: '222', label: '자기계발',},
                        {value: '223', label: '정치/사회',},
                        {value: '224', label: '예술·대중문화',},
                        {value: '225', label: '과학',},
                        {value: '226', label: '기술/공학',},
                        {value: '227', label: '컴퓨터·IT',},
                        {value: '228', label: '기타',}
                    ],

                },
                {
                    value: '23', label: '수험서·참고서',
                    children: [
                        {value: '231', label: '외국어',},
                        {value: '232', label: '자격증',},
                        {value: '233', label: '수능',},
                        {value: '234', label: '초등참고서',},
                        {value: '235', label: '중등참고서',},
                        {value: '236', label: '고등참고서',},
                        {value: '237', label: '기타',}

                    ],

                },
                {
                    value: '24', label: '기타',
                    children: [
                        {value: '241', label: '기타',}
                    ],

                },
            ],
        },
        {
            value: '3',
            label: '전자제품',
            children: [
                {
                    value: '31', label: '카메라',
                    children: [
                        {value: '311', label: '필름카메라·중형카메라',},
                        {value: '312', label: 'DSLR·미러리스',},
                        {value: '313', label: '렌즈/필터',},
                        {value: '314', label: '삼각대·플래시·조명',},
                        {value: '315', label: '기타',}
                    ],

                },
                {
                    value: '32', label: 'PC',
                    children: [
                        {value: '321', label: '데스크톱',},
                        {value: '322', label: '노트북',},
                        {value: '323', label: '기타',}
                    ],

                },
            ],
        },
        {
            value: '4',
            label: '오락',
            children: [
                {
                    value: '41', label: '게임기',
                    children: [
                        {value: '411', label: '닌텐도',},
                        {value: '412', label: '플레이스테이션',},
                        {value: '413', label: 'X box',}
                    ],

                },
                {
                    value: '42', label: '보드게임',
                    children: [
                        {value: '421', label: '순발력',},
                        {value: '422', label: '전략·심리',},
                        {value: '423', label: '커뮤니케이션',},
                        {value: '424', label: '카드',},
                        {value: '425', label: '기타',}
                    ],

                },
            ],
        }




    ];
    const [big, setBig] = useState();
    const [middle, setMiddle] = useState();
    const [small, setSmall] = useState();

    //제목, 내용
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    //대여금, 보증금
    const [price, setPrice] = useState();
    const [deposit, setDeposit] = useState();

    //계약날짜
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());

    //물품 상태, 이미지
    const [quality, setQuality] = useState();
    const [imageList, setImageList] = useState([]);

    //주소
    const [address, setAddress] = useState();

    //모달창 키고 끄기
    const [isModalVisible, setIsModalVisible] = useState(false);

    // <- input 값으로 text 변경 함수
    const setTitleChange = (e) => { setTitle(e.target.value); };
    const setContentChange = (e) => { setContent(e.target.value); };
    const setPriceChange = (e) => { setPrice(e.target.value); };
    const setDepositChange = (e) => { setDeposit(e.target.value); };
    const itemQualityHandleChange = (e) => { setQuality(e.target.value) };
    const setCategoryChange = (value) => {
        setBig(value[0])
        setMiddle(value[1])
        setSmall(value[2])
    }

    //사진 배열 넣기
    const onPictureChange = ({ fileList: newFileList }) => { setImageList(newFileList); console.log(imageList)};

    //daum 주소찾기 API를 이용하여 주소 가져오기
    const getAddress = (data) => {

        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
            setAddress(fullAddress)
            console.log(data)
        }
    }

    //모달창 보여주기, 끄기
    const showModal = () => { setIsModalVisible(true) };
    const modalClose = () =>{ setIsModalVisible(false) };

    //사진 미리보기
    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    //사진 최소 1장 경고
    const pictureAlert = () =>{
        if (imageList.length === 0){
            alert("적어도 한장 이상의 사진을 게시해주세요!")

        }
    }

    //startDate 오늘 날짜로 지정
    const disabledDate = (startDate) =>{
        return startDate && startDate < moment().startOf('day');
    }

    //endDate를 startDate부터 날짜로 지정
    const disabledEndDate = (endDate) =>{
        return endDate && endDate < startDate;
    }

    //data onSubmit
    const onSubmit = () => {

        const data = {
            categoryBig : big,
            categoryMiddle : middle,
            categorySmall : small,
            itemTitle : title,
            itemContent : content,
            itemQuality : quality,
            contractStatus : 1,
            startDate : startDate.format("YYYY-MM-DD"),
            endDate : endDate.format("YYYY-MM-DD"),
            price : price,
            deposit : deposit,
            itemAddress : address

        }

        const formData = new FormData();
        formData.append('item', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
        imageList.forEach(image => formData.append("itemPhoto", image.originFileObj))

        const option = {
            url : "/items/"+itemId,
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token"),
                'Content-Type': 'multipart/form-data'
            },
            data: formData

        }

        axios(option)
            .then(res=>{
                console.log(res.data);
                navigate(-1);
            }).catch(res=>{
            if (imageList.length === 0){
                alert("적어도 한장 이상의 사진을 게시해주세요!")
            }
            else if (address == undefined){
                alert("주소 찾기를 통해 주소를 입력해주세요!")
            }
            else {
                alert("모든 양식을 작성해주세요!")
            }
        });
    };

    //data 전송 실패시 오류 메세지
    const onSubmitFailed = (errorInfo) => {  //exception 발생 시 에러 원인 불러오기
        console.log("물품 등록에 실패했습니다",errorInfo);  //서버로 요청하는 값
    };

    const userNickName = sessionStorage.getItem("nickName");

    useEffect(() => {
        getItem()

    },[itemId])
    useEffect(() => {
        console.log(imageList)

    },[imageList])


    return (
        <div className="write">
            <header><HeaderPage/></header>

            <Card className="write_container"
                  form={form}
                  onFinish={onSubmit}
                  onFinishFailed={onSubmitFailed}>
                <Form>
                    <h1 className="h1"> {userNickName} 님의 물품 빌려 주기 <TagsFilled /> </h1>

                <div className="write_wrap">
                    <span>제목</span>

                    <Form.Item
                        className="title"
                        name = "title"
                        rules={[{required: true, message: '제목을 입력해주세요!'}]}>

                        <Input
                            placeholder="제목을 입력해주세요"
                            onChange={setTitleChange}
                        />
                    </Form.Item>
                </div>

                <div className="write_wrap">
                    <span>물품 정보</span>

                    <Form.Item
                        className="content"
                        name = "content"
                        rules={[{required: true, message: '물품 정보을 입력해주세요!'}]}>

                        <Input.TextArea
                            rows={5}
                            placeholder="물품 정보를 입력해주세요"
                            size="large"
                            showCount
                            maxLength={200}
                            onChange = {setContentChange}
                        />
                    </Form.Item>
                </div>

                <div className="write_wrap">
                    <span>대여금</span>

                    <Form.Item className="write_money"
                               name = "price"
                               rules={[{required: true, message: '대여금을 입력해주세요!'}]}>

                        <Input
                            type="number" placeholder="대여금을 입력해주세요"
                            onChange = {setPriceChange}
                        />
                    </Form.Item>
                </div>

                <div className="write_wrap">
                    <span>보증금</span>

                    <Form.Item className="write_money"
                               name = "deposit"
                               rules={[{required: true, message: '보증금을 입력해주세요!'}]}>

                        <Input type="number" placeholder="보증금을 입력해주세요"
                               onChange = {setDepositChange}
                        />
                    </Form.Item>
                </div>

                <div className="write_wrap">

                    <span>카테고리</span>

                    <Form.Item name="cate">
                        <Cascader
                            style={{ width: '420px'}}
                            options={writeOptions}
                            expandTrigger="hover"
                            placeholder="카테고리"
                            onChange={setCategoryChange}
                        />
                    </Form.Item>
                </div>


                <div className="write_wrap">
                    <span>사진</span>

                    <Form.Item
                        className = "itemPhoto"
                        name="itemPhoto"
                    >
                        <ImgCrop rotate>

                            <Upload
                                listType="picture"
                                fileList={imageList}
                                onPreview={onPreview}
                                onChange={onPictureChange}
                                beforeUpload={() => false}
                            >

                                <Button icon={<UploadOutlined />}>Upload</Button>

                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                </div>

                <div className="write_wrap">
                    <span>주소 찾기</span>

                    <Form.Item name = "address">

                        <Button type="primary" onClick={showModal}>
                            주소 찾기
                        </Button>

                        <Modal title="현재 주소 찾기"
                               visible={isModalVisible}
                               onOk={modalClose}
                               onCancel={modalClose}
                        >
                            <DaumPostCode
                                onComplete={getAddress}
                                autoClose={false}
                            />
                            {address}
                        </Modal>
                        <br/>
                        {address}

                    </Form.Item>
                </div>

                <div className="write_wrap">

                    <span>대여 기간</span>
                    <Form.Item name="date">
                        <span>시작일</span>
                        <br/>
                        <DatePicker
                            value={startDate}
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            disabledDate={disabledDate}
                        />
                        <br/>
                        <br/>
                        <span>종료일</span>
                        <br/>

                        <DatePicker
                            value={endDate}
                            onChange={date => setEndDate(date)}
                            selected={endDate}
                            disabledDate={disabledEndDate}
                        />
                    </Form.Item>

                </div>

                <div className="write_wrap">
                    <span>품질</span>

                    <Form.Item
                        name="quality"
                        initialValue={quality}
                    >

                        <label>상</label>
                        &nbsp;
                        <Input
                            type="radio"
                            value="HIGH"
                            checked={quality === "HIGH"}
                            onChange={itemQualityHandleChange}
                        />
                        &nbsp;
                        &nbsp;
                        <label>중</label>
                        &nbsp;
                        <Input
                            type="radio"
                            value="MIDDLE"
                            checked={quality === "MIDDLE"}
                            onChange={itemQualityHandleChange}
                        />
                        &nbsp;
                        &nbsp;
                        <label>하</label>
                        &nbsp;
                        <Input
                            type="radio"
                            value="LOW"
                            checked={quality === "LOW"}
                            onChange={itemQualityHandleChange}
                        />

                    </Form.Item>
                </div>

                <Form.Item>
                    <Button type="primary" ghost className="button" htmlType="submit"
                            onClick={()=>{onSubmit()}} > 빌려주기 </Button>
                </Form.Item>
                </Form>

            </Card>

        </div>
    )


}

export default AmendWritePage;