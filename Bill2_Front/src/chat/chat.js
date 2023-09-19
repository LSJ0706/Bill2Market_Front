import HeaderPage from "../header/header";
import React, {useEffect, useRef, useState} from "react";
import {
    Badge,
    Divider,
    Card,
    Avatar,
    Layout,
    BackTop,
    Input,
    Button,
    Image,
    Modal,
    DatePicker,
    Space,
    Col,
    Row
} from 'antd';
import "./chat.css";

import {useLocation, useNavigate} from "react-router-dom"
import Meta from "antd/es/card/Meta";
import {
    BarcodeOutlined,
    CloseOutlined,
    PictureOutlined,
    PlusOutlined,
    SendOutlined, TeamOutlined,
    UserSwitchOutlined
} from "@ant-design/icons";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";
import billyPay from "../billyPay/billyPay";

const messageType = ["TEXT", "IMG", "TRANS_REQUEST", "TRANS_ACCEPT", "APPROACH_EXPIRE", "EXPIRE", "TRANS_END", "BILL_START", "BILL_END"];

let curChatId = -1;
let ws;
/** 웹소켓 주소 설정 **/
let sock ;

function ChatPage () {
    const itemOption = {
        itemPic: "" ,
        itemTitle: "",
        itemPrice: "",
        itemDeposit: "",
        itemStartDate: "",
        itemEndDate: "",
        itemAddress: "",
        contractId: "",
        itemId : "",
        billpayStatus : "",
        ownerIndex : "",
        lenterIndex: "",
        ownerPic: "",
        lenterPic: "",
        permissionStatus : "",
        contractDate: ""
    }

    const [chatList, setChatList] = useState([]);
    const [key,setKey] = useState([]);

    const [items, setItems]= useState(itemOption);

    const [chattingTime, setChattingTime] = useState(new Map());

    const [messageLast, setMessageLast] = useState(new Map());

    const [allMessage, setAllMessage] = useState([]);

    const [socketMessage, setSocketMessage] = useState([]);

    const [addMenuVisible, setAddMenuVisible] = useState(false);

    const [visibleAll, setVisibleAll] = useState(false);

    const [visibleModifyButton, setVisibleModifyButton] = useState(false);

    const [dateModifyModalVisible, setDateModifyModalVisible] = useState(false);

    const [messageUrl, setMessageUrl] = useState("");

    const [contractStatus, setContractStatus] = useState("")

    const [billpayStatus, setBillpayStatus] = useState("NOTUSE");

    const [chatMessage, setChatMessage] = useState("");

    const [dateInputModalVisible, setDateInputModalVisible] = useState(false);

    const [chatItemId, setChatItemId] = useState("");
    const [contractChatId, setContractChatId] = useState("");
    const [contractPrice, setContractPrice] = useState("");
    const [contractDeposit, setContractDeposit] = useState("");
    const [contractStartDate, setContractStartDate] = useState("");
    const [contractEndDate, setContractEndDate] = useState("");

    const [ownerPic, setOwnerPic] = useState("");
    const [lenterPic, setLenterPic] = useState("");
    const [ownerNickName, setOwnerNickName] = useState("");
    const [lenterNickName, setLenterNickName] = useState("");

    const [endDate, setEndDate] = useState("");


    const [returnButtonDisable ,setReturnButtonDisable] = useState(false);

    const [tempMessageSplit, setTempMessageSplit] = useState([]);

    /** 웹소켓 연결 **/
    const connectWebSocket = () => {
        ws = Stomp.over(sock);
        ws.connect({Authorization: sessionStorage.getItem("token")},(frame)=>subscribeChat(), function(error){
            console.log(error);
        });
    }

    /** 채팅방 입장(구독) **/
    function subscribeChat(){
        return ws.subscribe('/sub/chat/'+curChatId, (message) => showMessage(message.body), { id: curChatId + "/" + sessionStorage.getItem("token"), Authorization: sessionStorage.getItem("token")});
    }

    /** 채팅방 퇴장(구독 취소) **/
    function unsubscribeChat(){
        if(curChatId != -1){
            // while(document.getElementById("chatMessage") != null){
            //     document.getElementById("chatMessage").remove()
            // }
            ws.unsubscribe(curChatId + "/" + sessionStorage.getItem("token"));
        }
    }

    /** 메시지 전송 **/
    function sendMessage(messageType){
        let msg = document.getElementById("sendMessage").value;

        const message = {
            chatId: curChatId,
            senderId: sessionStorage.getItem("clientIndex"),
            messageType : messageType,
            message : msg,
            isImg : 0
        }

        ws.send('/pub/chat/message', {id: curChatId + "/" + sessionStorage.getItem("token"),
            Authorization: sessionStorage.getItem("token")}, JSON.stringify(message));
    }

    /** 메세지 출력 (메세지 수신 시) **/
    function showMessage(message){
        console.log(tempMessageSplit);
        ChatItemProduct();
        let view = document.getElementById('message_boxes');
        const msg = JSON.parse(message);
        // messageWrite(tempMessageSplit);
        if(msg.message != null){
            let arr = socketMessage;
            arr.push(msg);
            setSocketMessage([...arr]);
        }

    }

    const showDateInputModal = () => {
        setDateInputModalVisible(true);
    };

    const inputHandleOk = () => {
        setDateInputModalVisible(false);
    };
    const inputHandleCancel = () => {
        setDateInputModalVisible(false);
    };


    const showDateModifyModal = () => {
        setDateModifyModalVisible(true);
    };

    const handleOk = () => {
        setDateModifyModalVisible(false);
    };
    const handleCancel = () => {
        setDateModifyModalVisible(false);
    };


    const dateFormat = 'YYYY-MM-DD';

    const navigate = useNavigate();


    const onClickProductDetail = () => {
        navigate("/productViewDetails",  {state : chatItemId});
    }

    const AWS = require("aws-sdk");

    const s3 = new AWS.S3 ({
        accessKeyId: "AKIA5JDRDAAYWXFYKPXK",
        secretAccessKey: "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",
    });

    const keyFunc = (url,index) => {
        let keyArray = url.split("/");
        let key = keyArray[3] + "/" + keyArray[4];
        const params = {
            Bucket: "bill2market",
            Key: key.toString()
        }
        s3.getObject(params, (err, data) => {
            if (err) {
                throw err;
            }
            let messageLast = data.Body.toString('utf-8');
            let messageLast2 = messageLast.split("\n");
            let messageLength = messageLast2.length-2;

            if(messageLength < 0) return;
            let messageLast3 = messageLast2[messageLength];
            let lastMessageType         = messageLast3.split(" ")[2];
            let chatMessageSplitContent = messageLast3.split(" ").slice(4).join(" ");
            let chatTime    = messageLast3.split(" ")[1];
            let chatTime2   = chatTime.split(":").slice(0,2).join(":");


            const chatMessageType = () => {
                if (lastMessageType === "0") {
                    return chatMessageSplitContent;
                }
                else if (lastMessageType  === "1") {
                    return ("이미지 파일을 보냈습니다.");
                }
                else if (lastMessageType  === "2") {
                    return ("거래가 요청되었습니다.");
                }
                else if (lastMessageType  === "3") {
                    return ("거래가 수락되었습니다.");
                }
                else if (lastMessageType  === "4") {
                    return ("계약기간 만료가 임박했습니다.");
                }
                else if (lastMessageType  === "5") {
                    return ("계약기간이 만료되었습니다.");
                }
                else {
                    return ("거래가 종료되었습니다.");
                }
            }
            setMessageLast((prev)=>new Map(prev).set(index,chatMessageType(lastMessageType)));
            setChattingTime((prev)=>new Map(prev).set(index,chatTime2));
        });
    }

    /** 새로운 거래 생성 **/
    const makeContract = () => {
    }

    /** 빌리페이 생성 **/
    const makeBillyPay = () => {
        sendMessage(7)
        changeBillpayStatus();
    }

    /** 계좌등록 **/
    const payButtonClick = () => {
        axios.get('contracts/account/' + items["contractId"],
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                },
            },
        )
            .then((res) => {
                //계좌 없을 때
                if(res.data.code === 2) {
                    if(window.confirm('결제를 진행하시려면 계좌 등록이 필요합니다. 계좌를 등록하시겠습니까?')){
                        window.open(res.data.data, '_blank')
                    }
                }
                //계좌 있을 때
                else {
                    alert("이미 계좌 등록을 완료하셨습니다!");
                }
                changeBillpayStatus();
            })
    }

    /** 빌리페이 상태 변경 **/
    const changeBillpayStatus = () => {
        axios.put('contracts/bill-pay/status/' + items["contractId"],
            null,
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                },
            },
        )
            .then((res) => {
                setBillpayStatus(res.data.data);
            }).catch(res => {
            console.log("Fail to change billpayStatus")
        })
    }


    const chatInfo = () => {
        axios.get("chats/client", {
            headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}
        })
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    response.data.data.map((chat, index) =>
                        keyFunc(chat.fileName, index)
                    );
                    setChatList(response.data.data);
                    console.log(chatList);

                }
            })
            .catch(res => {
                console.log("fail");
            })
    }




    const ChatItemProduct  = async () => {
        try {
            const response = await axios.get("contracts/" + curChatId,
                {
                    headers: {
                        Authorization: 'Bearer ' + sessionStorage.getItem("token")
                    }
                }
            )

            if (response.status >= 200 && response.status <= 204) {
                const newItems = {
                    itemPic: response.data.data.chat.item.photos[0].itemPhoto,
                    itemTitle: response.data.data.chat.item.itemTitle,
                    itemPrice: "대여료(일) : " + response.data.data.chat.item.price + "원",
                    itemDeposit: "보증금 : " + response.data.data.chat.item.deposit + "원",
                    itemAddress: response.data.data.chat.item.itemAddress,
                    contractId: response.data.data.contractId,
                    itemId: response.data.data.chat.item.itemId,
                    ownerIndex: response.data.data.chat.owner.clientIndex,
                    lenterIndex: response.data.data.chat.lenter.clientIndex,
                    permissionStatus : response.data.data.permissionStatus,
                    contractDate : response.data.data.contractDate
                }
                console.log(response.data.data.permissionStatus);
                setBillpayStatus(response.data.data.billpayStatus);
                setItems(newItems);

                setContractStatus(response.data.data.contractStatus);
                setChatItemId(response.data.data.chat.item.itemId);
                setContractChatId(response.data.data.chat.chatId);
                setContractPrice(response.data.data.chat.item.price);
                setContractDeposit(response.data.data.chat.item.deposit);
                setContractStartDate(response.data.data.startDate);
                setContractEndDate(response.data.data.endDate);

                setOwnerPic(response.data.data.chat.owner.clientPhoto);
                setLenterPic(response.data.data.chat.lenter.clientPhoto);
                setOwnerNickName(response.data.data.chat.owner.nickname);
                setLenterNickName(response.data.data.chat.lenter.nickname);
            }
        } catch(err){
            console.log("fail to read contract info\n", err);
        }
    }

    const getContractStatus = async () => {
        try {
            const response = await axios.get("contracts/" + curChatId,
                {
                    headers: {
                        Authorization: 'Bearer ' + sessionStorage.getItem("token")
                    }
                }
            )

            if (response.status >= 200 && response.status <= 204) {
                setContractStatus(response.data.data.contractStatus);
            }
        } catch(err){
            console.log("fail to read contract info\n", err);
        }
    }

    //계약 상태  변경 axios
    const  changeContractStatus= (contractId,status) => {
        console.log("changeContractStatus");
        axios.put("contracts/status/" + contractId, "contractStatus="+status ,
            {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    setContractStatus(response.data.data);
                    ChatItemProduct();
                }
            })
            .catch(res => {
                console.log("fail");
            })};


    //계약 날짜 변경 axios
    const changeContractDate = (contractId,date) => {
        console.log("changeContractDate")
        axios.put("contracts/end-date/" + contractId,  "endDate="+date.format("YYYY-MM-DD"),
            {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    console.log(response.data.data);
                    setContractEndDate(response.data.data);
                    ChatItemProduct();
                }

            })
            .catch(res => {
                console.log("fail");
            })};

    //새로운 계약 생성 api
    const writeChatContract = (chatId, price, deposit, startDate, endDate) => {
        console.log("writeChatContract")
        axios.post("contracts/" + chatId,
            {chatId : chatId, price : price, deposit : deposit, startDate : startDate, endDate : endDate},
            {headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token")}})
            .then((response) => {
                if (response.status >= 200 && response.status <= 204) {
                    alert("거래요청에 성공했습니다.")
                    const newItems = {...items}
                    newItems.contractId = response.data.data.contractId;
                    setContractStatus(response.data.data.contractStatus);
                    newItems.itemPrice = "대여료(일) : " + response.data.data.price + "원";
                    newItems.itemDeposit = "보증금 : " + response.data.data.deposit + "원";
                    newItems.permissionStatus = response.data.data.permissionStatus;
                    setItems(newItems);
                }})
            .catch(res => {
                console.log("fail");
            })};

    const changeBillPayContractStatus = ()=>{

    }

    function messageSet () {
        const list = chatList.map((chat,index)=>{
            const container = chat;
            container.message = messageLast.get(index);
            container.time = chattingTime.get(index);
            return container;
        })
        setChatList(list);
    }

    /** 컴포넌트 시작시 웹소켓 연결, 종료시 구독 해제 **/
    useEffect(() => {
        sock = new SockJS('bill2-ws');
        connectWebSocket();
        chatInfo();
        return()=>{
            unsubscribeChat();
        }
    }, []);

    // useEffect(()=>{
    //     console.log("items")
    //     console.log(items)
        // if (messageUrl.length > 0) {
        //     otherMessage();
        // }
    // },[items])

    useEffect(()=>{
        if (messageUrl.length > 0) {
            messageWrite(tempMessageSplit);
        }
    },[billpayStatus, contractStatus, contractEndDate])

    useEffect(()=>{
    },[chatList])

    useEffect(()=>{
    },[socketMessage])

    /** curChatId 변경시 **/
    useEffect(()=>{
    }, [curChatId]);

    useEffect(() => {
        messageSet();
    }, [messageLast,chattingTime]);

    useEffect(() => {
        if (messageUrl.length > 0) {
            otherMessage();
        }
    }, [messageUrl]);


    useEffect(() => {
        if(messageUrl.length >0) {
            messageWrite(tempMessageSplit);
        }
    }, [visibleModifyButton,dateModifyModalVisible]);

    useEffect(() => {
        messageWrite();
    },[tempMessageSplit])

    const otherProduct = async (url) => {
        await ChatItemProduct();
        setMessageUrl(url);
    }

    /** 메세지를 타입별로 출력해주는 함수 **/
    const MessageType = (temp) => {
        switch (temp.messageType){
            case "TEXT":
                return temp.message;
            case "IMG":
                return (
                    <Image className="chatItemImage" src={ items["itemPic"]}/>
                );
            case "TRANS_REQUEST":
                return (
                    (
                        () => {

                            const tempMessage = JSON.parse(temp.message);
                            const tempMessages = tempMessage.endDate;
                           console.log(contractStatus);

                            if (tempMessages === undefined && contractStatus === "REQUEST"){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+contractStartDate+" ~ "+contractEndDate}</p>
                                        {visibleModifyButton === false ?
                                            <Button type="primary" ghost className="contractCardButtonAccept"
                                                    onClick={()=>{
                                                        changeContractStatus(items["contractId"],1);
                                                    }}>수락</Button> :null}

                                        {visibleModifyButton === false ?
                                            <Button danger className="contractCardButtonDeny"
                                                    onClick={()=>{setVisibleModifyButton(true);
                                                    }}>거절</Button> :null}

                                        {visibleModifyButton === true ?
                                            <p className="contractCardReturnSuccess">거래가 거절되었습니다.</p> :null}
                                    </Card> )

                            }
                            else if (tempMessages === undefined && contractStatus === "TRANSACTION" || contractStatus === "EXPIRATION"){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : " + contractStartDate+ " ~ " + contractEndDate}</p>
                                        <Button type="primary" ghost className="contractCardButtonModifyDate"
                                                onClick={showDateModifyModal}>계약기간 수정</Button>
                                        <Modal
                                            title={"계약기간 수정"}
                                            visible={dateModifyModalVisible}
                                            onOk={handleOk}
                                            onCancel={handleCancel}
                                            footer={[
                                                <Button onClick={() => {
                                                    handleOk();
                                                    changeContractDate(items["contractId"],endDate);
                                                }}>
                                                    변경하기
                                                </Button>,
                                                <Button onClick={handleOk}>
                                                    닫기
                                                </Button>,]}>
                                            <Space direction="horizontal" size={12}>
                                                <DatePicker
                                                    defaultValue={moment(contractStartDate, dateFormat)}
                                                    format={dateFormat}
                                                    disabled />
                                                <p> ~ </p>
                                                <DatePicker
                                                    defaultValue={moment(contractEndDate, dateFormat)}
                                                    format={dateFormat}
                                                    onChange={date=> setEndDate(date)}
                                                />
                                            </Space>
                                        </Modal>
                                    </Card>
                                )
                            }
                            else if (tempMessages === undefined && contractStatus === "TERMINATION") {
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : " + contractStartDate + " ~ " + contractEndDate}</p>
                                        <Button type="primary" ghost className="contractCardButtonModifyDate"
                                                onClick={() => {
                                                    onClickProductDetail();
                                                }}>물품 상세 보기</Button>
                                    </Card>
                                )
                            }

                            if (tempMessages !== contractEndDate){

                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+tempMessage.startDate+" ~ "+tempMessage.endDate}</p>
                                        <p className="contractCardReturnSuccess">계약기간이 변경되었습니다.</p>
                                    </Card> )
                            }
                            if  (contractStatus === "REQUEST"){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+tempMessage.startDate+" ~ "+tempMessage.endDate}</p>
                                        {visibleModifyButton === false ?
                                            <Button type="primary" ghost className="contractCardButtonAccept"
                                                    onClick={()=>{
                                                        changeContractStatus(items["contractId"],1);
                                                    }}>수락</Button> :null}

                                        {visibleModifyButton === false ?
                                            <Button danger className="contractCardButtonDeny"
                                                    onClick={()=>{setVisibleModifyButton(true);
                                                    }}>거절</Button> :null}

                                        {visibleModifyButton === true ?
                                            <p className="contractCardReturnSuccess">거래가 거절되었습니다.</p> :null}
                                    </Card> )

                            }
                            else if (contractStatus === "TRANSACTION" || contractStatus === "EXPIRATION"){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : " + tempMessage.startDate + " ~ " + tempMessage.endDate}</p>
                                        <Button type="primary" ghost className="contractCardButtonModifyDate"
                                                onClick={showDateModifyModal}>계약기간 수정</Button>
                                        <Modal
                                            title={"계약기간 수정"}
                                            visible={dateModifyModalVisible}
                                            onOk={handleOk}
                                            onCancel={handleCancel}
                                            footer={[
                                                <Button onClick={() => {
                                                    handleOk();
                                                    changeContractDate(items["contractId"],endDate);
                                                }}>
                                                    변경하기
                                                </Button>,
                                                <Button onClick={handleOk}>
                                                    닫기
                                                </Button>,]}>

                                            <Space direction="horizontal" size={12}>
                                                <DatePicker
                                                    defaultValue={moment(tempMessage.startDate, dateFormat)}
                                                    format={dateFormat}
                                                    disabled />
                                                <p> ~ </p>
                                                <DatePicker
                                                    defaultValue={moment(tempMessage.endDate, dateFormat)}
                                                    format={dateFormat}
                                                    onChange={date=> setEndDate(date)}
                                                />
                                            </Space>
                                        </Modal>
                                    </Card>
                                )
                            }  else if (contractStatus === "TERMINATION" ) {
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : " + tempMessage.startDate + " ~ " + tempMessage.endDate}</p>
                                        <Button type="primary" ghost className="contractCardButtonModifyDate"
                                                onClick={() => {
                                                    onClickProductDetail();
                                                }}>물품 상세 보기</Button>
                                    </Card>
                                )
                            }
                            // else {
                            //     return (
                            //         <p className="contractCardCompo">잘못된 계약타입 입니다.</p>
                            //     )
                            // }
                        })
                )();
            case "TRANS_ACCEPT":
                return ((
                        () => {

                            console.log(items["permissionStatus"]);
                            console.log(contractStatus);
                            if (contractStatus === "REQUEST" && (items["permissionStatus"] === "OWNERACCEPT" || items["permissionStatus"] === "LENTERACCEPT")){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+contractStartDate+" ~ "+contractEndDate}</p>
                                        <p className="contractCardReturnSuccess">계약을 수락했습니다. 상대방 또한 수락버튼을 누르면 계약이 성사됩니다.</p>

                                    </Card> )}

                            if (contractStatus === "REQUEST" && items["contractDate"] !== null){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+contractStartDate+" ~ "+contractEndDate}</p>
                                        <p className="contractCardReturnSuccess">계약기간이 변경되었습니다.</p>

                                    </Card> )}

                            else if (contractStatus === "TRANSACTION" || contractStatus === "EXPIRATION"){
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+contractStartDate+" ~ "+contractEndDate}</p>
                                        <p className="contractCardReturnSuccess">계약이 완료되었습니다.</p>
                                        <Button type="primary" ghost className="returnSuccessButton" disabled={returnButtonDisable}
                                                onClick={() => {
                                                    changeContractStatus(items["contractId"],3);
                                                    setReturnButtonDisable(true);
                                                }}>반납 완료</Button>
                                    </Card> )}

                            else if (contractStatus === "TERMINATION" ) {
                                return (
                                    <Card className="contractMessageCard">
                                        <Image className="chatInitImage" src={ items["itemPic"]}/>
                                        <p className="contractCardCompo">{items["itemTitle"]}</p>
                                        <p className="contractCardCompo">{items["itemPrice"]}</p>
                                        <p className="contractCardCompo">{items["itemDeposit"]}</p>
                                        <p className="contractCardCompo">{"계약기간 : "+contractStartDate+" ~ "+contractEndDate}</p>
                                        <p className="contractCardReturnSuccess">계약이 완료되었습니다.</p>
                                    </Card> )}
                            // else {
                            //     return (
                            //         <p className="contractCardCompo">잘못된 계약타입 입니다.</p>
                            //     )
                            // }
                        })
                )();

            case "APPROACH_EXPIRE":
                return (
                    <Card className="contractMessageCard">
                        <p className="contractCardReturnCompo">계약 기간이 3일 뒤에 만료됩니다!</p>
                        <p className="contractCardCompo">반납을 확인하신 뒤에는 반드시 "반납 완료" 버튼을 눌러주시기 바랍니다.</p>
                    </Card>
                );
            case "EXPIRE":
                return (
                    <Card className="contractMessageCard">
                        <p className="contractCardReturnCompo">계약 기간이 만료되었습니다!</p>
                        <p className="contractCardCompo">3일 이내에 "반납 완료"
                            버튼을 누르지 않으면 자동으로 반납 완료 처리가 되며, 거래가 종료됩니다.</p>
                    </Card>
                );

            case "TRANS_END":
                return ((
                        () => {
                            if (contractStatus !== "TERMINATION") {
                                return (
                                    <Card className="contractMessageCard">
                                        <p className="contractCardReturnCompo2">반납이 완료되었습니다.</p>
                                        <p className="contractCardReturnCompo">상대방 또한 반납 완료 버튼을 누르면 거래가 완료됩니다.</p>
                                    </Card>
                                )}

                            else if (contractStatus === "TERMINATION") {
                                return (
                                    <Card className="contractMessageCard">
                                        <p className="contractCardReturnCompo2">반납 완료가 확인되었습니다.</p>
                                        <p className="contractCardReturnCompo">거래가 완료되었습니다.</p>
                                    </Card>
                                )}
                        })
                )();
            case "BILL_START" :

                return (
                    () => {
                        //구매자
                        if (items["lenterIndex"] == sessionStorage.getItem("clientIndex")) {
                            return (
                                <Card className="contractMessageCard">
                                    <p className="contractCardReturnCompo">빌리페이 해요!</p>
                                    {(billpayStatus==="REQUESTBILLYPAY"|| billpayStatus==="REGISTEROWNERACCOUNT")?
                                        <Button type="primary" ghost className="returnSuccessButton"
                                                onClick={async () => {
                                                    window.open('/billyPay?itemId=' + items['itemId'] + '&contractId=' + items["contractId"], 'top');
                                                    changeBillpayStatus();
                                                }}>결제</Button>
                                        :
                                        <p className="contractCardReturnCompo2">결제 완료</p>}
                                </Card>
                            )
                        }
                        //판매자
                        else if (items["ownerIndex"] == sessionStorage.getItem("clientIndex")){
                            return (
                                <Card className="contractMessageCard">
                                    <p className="contractCardReturnCompo">빌리페이 해요!</p>
                                    {(billpayStatus==="REQUESTBILLYPAY" || billpayStatus==="PAYLENTER")?
                                        <Button type="primary" ghost className="returnSuccessButton"
                                                onClick={() => {
                                                    payButtonClick();
                                                }}>입금 계좌 등록</Button>
                                        :
                                        <p className="contractCardReturnCompo2">계좌 등록 완료</p>
                                    }
                                </Card>
                            )
                        }
                        // Exception
                        else return "CLIENT ERROR! : " + " / " + items["ownerIndex"] + " / " + items["lenterIndex"];
                    })();
            case"BILL_END":
                // 빌리페이 완료 메세지가 올 경우 빌리페이상태 변경
                // if(billpayStatus !== "RETURNCOMPLETE"){
                //     console.log("RETURNCOMPLETE")
                //     setBillpayStatus("RETURNCOMPLETE")
                // }
                return (
                    () => {
                        //구매자
                        if (items["lenterIndex"] == sessionStorage.getItem("clientIndex")){
                            return (
                                <Card className="contractMessageCard">
                                    <p className="contractCardReturnCompo">빌리페이 완료</p>
                                    <p className="contractCardCompo">계좌로 보증금 송금이 완료되었습니다.</p>
                                </Card>
                            )}
                        //판매자
                        else {
                            return (
                                <Card className="contractMessageCard">
                                    <p className="contractCardReturnCompo">빌리페이 완료</p>
                                    <p className="contractCardCompo">계좌로 대여로 송금이 완료되었습니다.</p>
                                </Card>)}
                    })();
            default:
                return ("잘못된 형식의 메세지입니다.");
        }
    }          //메세지 형식에 따라 메세지 내용 변경


    const otherMessage = () => {
        console.log(messageUrl)
        let keyArray = messageUrl.split("/");
        let key = keyArray[3] + "/" + keyArray[4];
        const params = {
            Bucket : "bill2market",
            Key    : key.toString()
        }
        s3.getObject(params, (err, data) => {
            if (err) {
                throw err;
            }

            let message      = data.Body.toString('utf-8');
            let messageSplit = message.split("\n");
            let deleteLast   = messageSplit.slice(0,-1);   //마지막 빈 배열 제거

           setTempMessageSplit([...deleteLast]);


        });
    }

    const messageWrite = () => {
        let array        = new Array();
        let clientIndex  = sessionStorage.getItem("clientIndex");


        let tempDate     = "";
        tempMessageSplit.map(string=> {
            let temp         = new Object();
            let messageArray = string.split(" ");
            temp.date = messageArray[0];
            temp.dateSplit = temp.date.split("-")[0] + "년 " + temp.date.split("-")[1] + "월 " + temp.date.split("-")[2] + "일"
            //배열에서 중복 날짜 제거
            if (temp.dateSplit === tempDate) temp.dateSplit = null;
            else tempDate = temp.dateSplit;

            temp.time          = messageArray[1]
            temp.timeSplit     = temp.time.split(":").slice(0,2).join(":");
            temp.messageType   = messageType[messageArray[2]];
            temp.clientIndex   = messageArray[3];
            temp.message       = messageArray.slice(4).join(" ");
            temp.messageDivide = MessageType(temp);



            if (messageArray[3] == clientIndex) {  //발신자
                if (clientIndex != items["ownerIndex"]) //대여자가 발신자일 경우
                    temp.owner = false;
                else if (clientIndex == items["ownerIndex"]) //소유자가 발신자일 경우
                    temp.owner = true;
            }
            else if (messageArray[3] != clientIndex ) {  //수신자
                if (clientIndex != items["ownerIndex"]) //대여자가 수신자일 경우
                    temp.owner = true;
                else if (clientIndex == items["ownerIndex"]) //소유자가 수신자일 경우
                    temp.owner = false;
            }


            if (messageArray[3] === clientIndex) temp.sender = true;
            else temp.sender = false;



            array.push(temp);
        })
        setAllMessage(array);
    }
    // 0 : 일반 텍스트
    //
    // 1 : 이미지파일의 S3 링크
    //
    // 2 : 거래요청 메세지 (contract_id, start_date, end_date 저장)
    //
    // 3 : 거래수락 메세지 (contract_id)
    //
    // 4 : 계약기간 만료 임박 알림 메세지 (contract_id)
    //
    // 5 : 계약기간 만료 알림 메세지 (contract_id)
    //
    // 6 : 거래종료 메세지 (contract_id)

    return (
        <Layout className="chatPageMain">
            <header>
                <HeaderPage></HeaderPage>
            </header>

            <Divider></Divider>

            <Layout className="userNickname">
                <p className="userNicknameFont">{sessionStorage.getItem("nickName")} 님의 Billie Market 채팅방 <TeamOutlined /> </p>
            </Layout>

            <Layout className="chatPage_container">
                {chatList.map(chat => {
                        return (
                            <Card className="chatCard"
                                  hoverable
                                  onClick={() => {
                                      if(chat.chatId != curChatId){
                                          const arr = socketMessage;
                                          arr.length = 0;
                                          setSocketMessage(arr);
                                          unsubscribeChat();
                                          curChatId = chat.chatId
                                          subscribeChat();
                                      }
                                      otherProduct(chat.fileName)
                                      setAddMenuVisible(false)
                                      setVisibleAll(true)
                                      // loadAllMessage();
                                  }}>
                                <Meta
                                    avatar={<Badge size="small" ><Avatar src={chat.clientPhoto}/> </Badge>}
                                    title={chat.nickname}
                                    description= {chat.message}
                                />
                                <p className="date">{chat.time}</p>
                            </Card>
                        )
                    }
                )}




            </Layout>


            {visibleAll === true ?
                <Layout className="chatPageDetails_container">
                    <Card className="chatProductCard">
                        <Image className="chatItemImage" src={ items["itemPic"]}/>
                        <p className="chatItemTitle">{ items["itemTitle"]}</p>
                        <p className="chatItemPrice">{items["itemPrice"]}</p>
                        <p className="chatItemDeposit">{items["itemDeposit"]}</p>
                    </Card>
                    <div>
                        {allMessage.map((message) => {

                            return (
                                <div className={message.sender ? "sendMessage" : "receiveMessage"}>
                                    {message.dateSplit != null ?
                                        <div className="dateBox">{"<" + message.dateSplit + ">"}</div> : null}
                                    <div className="userProfile">
                                        <p className={message.sender ?   "lenterNicknameDetail" : "ownerNicknameDetail"}>
                                            {message.owner ? ownerNickName : lenterNickName }</p>
                                        <Avatar src= {message.owner ? ownerPic :  lenterPic }/>
                                    </div>
                                    <div
                                        className={message.sender ? "sendMessageBox" : "receiveMessageBox"}>{message.messageDivide}</div>

                                    <div className={message.sender ? "sendMessageTimeBox" : "receiveMessageTimeBox"}>{message.timeSplit}</div>

                                </div>
                            );
                        })}
                    </div>
                    <div id={"message_boxes"}>
                        {socketMessage.map((message) => {
                            let clientIndex  = sessionStorage.getItem("clientIndex");

                            if (message.senderId == clientIndex) {  //발신자
                                if (clientIndex != items["ownerIndex"]) //대여자가 발신자일 경우
                                    message.owner = false;
                                else if (clientIndex == items["ownerIndex"]) //소유자가 발신자일 경우
                                    message.owner = true;
                            }
                            else if (message.senderId != clientIndex ) {  //수신자
                                if (clientIndex != items["ownerIndex"]) //대여자가 수신자일 경우
                                    message.owner = true;
                                else if (clientIndex == items["ownerIndex"]) //소유자가 수신자일 경우
                                    message.owner = false;
                            }

                            if (message.senderId == clientIndex) {
                                message.sender = true;
                            }
                            else if (message.senderId != clientIndex) {
                                message.sender = false;
                            }

                            return (
                                <div className={message.senderId == sessionStorage.getItem("clientIndex")? "sendMessage" : "receiveMessage"}>
                                    <div className="userProfile">
                                        <p className={message.sender ?    "lenterNicknameDetail" : "ownerNicknameDetail"}>
                                            {message.owner ? ownerNickName : lenterNickName }</p>
                                        <Avatar src= {message.owner ? ownerPic :  lenterPic }/>
                                    </div>
                                    <div className={message.senderId == sessionStorage.getItem("clientIndex")?
                                        "sendMessageBox" : "receiveMessageBox"}>{MessageType(message)}</div>
                                    <div className="timeBox">{message.createDate.split(' ')[1].split(':').slice(0,2).join(":")}</div>
                                </div>
                            );
                        })}
                    </div>
                </Layout> :null}

            {visibleAll === true ?
            <Layout className="inputMessages_container">

                <Button className= "plusButton"
                        onClick={()=>{
                            setAddMenuVisible(!addMenuVisible);
                        }}>
                    {addMenuVisible ? <CloseOutlined /> : <PlusOutlined />}
                </Button>

                <Input className="inputMessage" id={"sendMessage"}
                       onChange={(e) => {
                           setChatMessage(e.target.value);
                       }}
                       placeholder="메세지를 입력하세요." value={chatMessage}>
                </Input>

                <Button className="chatSendButton" onClick={() => {sendMessage(0); setChatMessage("");}}>
                    <SendOutlined style={{ color: "#3a89f8" }}/>
                </Button>

            </Layout> :null}

            {addMenuVisible === true ?
            <Layout className="plusMenu_container">

                    <div className="addMenu">

                        <Button type="text" className="addMenuButton">
                            <PictureOutlined  style={{ fontSize: "30px" }} />
                            <p className="addMenuFont">이미지</p>
                        </Button>

                        <Button type="text" className="addMenuButton" disabled={!items["contractId"] == ""}
                                onClick={() => {showDateInputModal()
                                }}>
                            <UserSwitchOutlined  style={{ fontSize: "30px" }} />
                            <p className="addMenuFont">거래하기</p>
                        </Button>

                        <Modal
                            title={"계약기간 입력"}
                            visible={dateInputModalVisible}
                            onOk={inputHandleOk}
                            onCancel={inputHandleCancel}
                            footer={[
                                <Button onClick={() => {

                                    if (contractStartDate === "" && contractEndDate === "") {
                                        alert("계약 시작일을 입력해주세요!")
                                    }
                                    else if (contractStartDate === "") {
                                        alert("계약 시작일을 입력해주세요!")
                                    }

                                    else if (contractEndDate === "") {
                                        alert("계약 마감일을 입력해주세요!")
                                    }
                                    else if (contractStartDate <= contractEndDate) {
                                        console.log(contractStartDate);
                                        console.log(contractEndDate);

                                        writeChatContract(contractChatId, contractPrice,contractDeposit, contractStartDate, contractEndDate)
                                        inputHandleOk();

                                        setAddMenuVisible(false);

                                    }
                                    else if (contractStartDate > contractEndDate) {
                                        console.log(contractEndDate);
                                        alert("계약마감일은 계약시작일보다 빠를 수 없습니다!")
                                    }


                                }}>
                                    입력하기
                                </Button>,
                                <Button onClick={inputHandleOk}>
                                    닫기
                                </Button>,]}>

                            <Space direction="horizontal" size={12}>
                                <DatePicker
                                    placeholder="계약 시작일"
                                    format={dateFormat}
                                    onChange={
                                        date=> {
                                            if (date === null) {
                                                setContractStartDate("")
                                            }
                                            else if (date != null) {
                                                setContractStartDate(date.format("YYYY-MM-DD"))
                                            }
                                        }
                                    }
                                    // value={contractStartDate!== "" ? moment(contractStartDate) : ""}
                                />
                                <p> ~ </p>
                                <DatePicker
                                    placeholder="계약 마감일"
                                    format={dateFormat}
                                    onChange={
                                        date=> {
                                            if (date === null) {
                                                setContractEndDate("")

                                            }
                                            else if (date != null) {
                                                setContractEndDate(date.format("YYYY-MM-DD"))
                                            }
                                        }
                                    }
                                    // value={contractEndDate!== "" ? moment(contractEndDate) : ""}
                                />
                            </Space>
                        </Modal>


                        <Button type="text" className="addMenuButton" onClick={makeBillyPay}
                                disabled={(billpayStatus==="NOTUSE" && contractStatus==="TRANSACTION")?
                                    false:true}>
                            <BarcodeOutlined style={{ fontSize: "30px" }} />
                            <p className="addMenuFont">빌리페이</p>
                        </Button>


                    </div>
            </Layout>:null}
        </Layout>

    )
};


export default ChatPage;
