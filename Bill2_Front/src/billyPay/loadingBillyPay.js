import React, {useEffect} from 'react';
import axios from "axios";
import {useLocation} from "react-router";
import './loadingBillyPay.css'

function Loader() {
    const {state} = useLocation();

    const data = {
        price : sessionStorage.getItem('price'),
        deposit : sessionStorage.getItem('deposit'),
    }

    const payTransfer = () => {
        const option = {
            url : 'contracts/transfer',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token"),
            },
            data: data

        }

        axios(option)
            .then(res=>
            {
                console.log(res.data);
                if(res.data.message === '성공하였습니다.') {
                    alert("결제가 완료되었습니다.")
                    window.close()
                }

            })
    }


    useEffect(() => {


        if(state != null && state !== '' && state != undefined) data.contractId = state;
        else {
            /** URL로 파라미터 수신 **/
            const params = window.location.search.replace("?", "").split("&");
            data.contractId = params[0].split("=")[1];
        }
        payTransfer()
    },[state])
    return (
        <div className="contentWrap">
            <h1>결제 중</h1>
            <img src={require('./doing.png')} className="rotate_sh"/>
        </div>
    );
}

export default Loader;
