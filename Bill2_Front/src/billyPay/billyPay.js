import React, {Fragment, useEffect, useState} from 'react'
import './billyPay.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Button} from 'antd';

function BillyPayPage(location) {
    const [itemList, setItemList] = useState([])
    const [photo, setPhoto] = useState()
    const [payment, setPayment] = useState('')
    const [price, setPrice] = useState('')
    const [deposit, setDeposit] = useState('')
    const [fees, setFees] = useState('')
    const [itemId, setItemId] = useState('')
    const [contractId, setContractId] = useState('')
    const navigate = new useNavigate()

    const format = (date) => {
        return date.getFullYear() + "년 " + (("00" + (date.getMonth() + 1))).slice(-2) + "월 " + (("00" + date.getDate()).slice(-2)) + "일 ";
    }

    const payButtonClick = () => {
        axios.get('contracts/account/' + contractId,
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                },
            },
        )
            .then((res) => {
                console.log(res)
                //계좌 없을 때
                if(res.data.code === 2) {
                    if(window.confirm('결제를 진행하시려면 계좌 등록이 필요합니다. 계좌를 등록하시겠습니까?')){
                        window.open(res.data.data, '_blank')
                    }
                }
                //계좌 있을 때
                else {
                    navigate('/loading',{state : contractId});
                }
            })
    }

    const getItem = () => {
        axios.get('items/' + itemId,
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            }
            ,
        )
            .then((res) => {
                {
                    console.log(res.data)
                    setItemList(res.data.data.item)
                    setPhoto(res.data.data.item.photos[0].itemPhoto)
                    setPrice(res.data.data.item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    setDeposit(res.data.data.item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    setFees((res.data.data.item.price * 0.05).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    setPayment((res.data.data.item.price + res.data.data.item.deposit + res.data.data.item.price * 0.05).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                    sessionStorage.setItem('price', res.data.data.item.price)
                    sessionStorage.setItem('deposit', res.data.data.item.price)
                }

            })
            .catch(res => {

            })
    }

    useEffect(()=>{
        /** URL로 파라미터 수신 **/
        const params = window.location.search.replace("?", "").split("&");
        setItemId(params[0].split("=")[1]);
        setContractId(params[1].split("=")[1]);
    },[])

    useEffect(()=>{
        getItem()
    },[contractId, itemId])

    return (

        <div className='allPayWrap'>

            <div className='payWrap'>
                <div>결제상세</div>

<div className='itemPhoto'>
    <img className="phoneImage" src={photo}/>
</div>

<div className='content'>
    <p>{itemList.itemTitle}</p>
    <p>대여료 : {price}</p>
    <p>보증금 : {deposit}</p>
    <p>계약일 : {format(new Date(itemList.startDate))} ~ {format(new Date(itemList.endDate))}</p>
</div>

<div className='payContent'>
    <div><h2>결제금액</h2><h2>{payment}원</h2></div>
    <div><h2>대여료</h2> <h2>{price}원</h2></div>
    <div><h2>보증금</h2><h2>{deposit}원</h2></div>
    <div><h2>빌리페이 수수료</h2> <h2>{fees}원</h2></div>
</div>
   <p>보증금은 물품 반납을 완료하신 뒤에 등록하신 계좌로 전액 환급 받으실 수 있습니다.</p>
</div>

<div>
    주문 내용을 확인하였으며, 결제에 동의합니다.
    <Button onClick={payButtonClick}> 결제하기 </Button>
</div>

</div>
)
}

export default BillyPayPage;
