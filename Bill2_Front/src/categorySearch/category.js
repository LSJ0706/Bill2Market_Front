import React, {Fragment, useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Cascader} from "antd";
import {useNavigate} from "react-router"
import { useSelector, useDispatch } from "react-redux";




function CategoryPage()  {
    const dispatch = useDispatch();
    const options = [
        {
            value: '1',
            label: '여가·스포츠',
            children: [
                {
                    value: '10', label: '전체',

                },
                {
                    value: '11', label: '오토바이·스쿠터',
                    children: [
                        {value: '110', label: '전체',},
                        {value: '111', label: '125cc 이하',},
                        {value: '112', label: '125cc 초과',},
                        {value: '113', label: '주변장비',}
                    ],

                },
                {
                    value: '12', label: '자전거',
                    children: [
                        {value: '120', label: '전체',},
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
                        {value: '130', label: '전체',},
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
                        {value: '140', label: '전체',},
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
                    value: '20', label: '전체',

                },
                {
                    value: '21', label: '문학',
                    children: [
                        {value: '210', label: '전체',},
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
                        {value: '220', label: '전체',},
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
                        {value: '230', label: '전체',},
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
                    value: '30', label: '전체',

                },
                {
                    value: '31', label: '카메라',
                    children: [
                        {value: '310', label: '전체',},
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
                        {value: '320', label: '전체',},
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
                    value: '40', label: '전체',

                },
                {
                    value: '41', label: '게임기',
                    children: [
                        {value: '410', label: '전체',},
                        {value: '411', label: '닌텐도',},
                        {value: '412', label: '플레이스테이션',},
                        {value: '413', label: 'X box',}
                    ],

                },
                {
                    value: '42', label: '보드게임',
                    children: [
                        {value: '420', label: '전체',},
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
    const navi =useNavigate();


    const onChange = (value) => {
        dispatch({type: "CATEGORY", payload: value})
        navi('/')
    }


    return (
        <Fragment>


            <Cascader
                style={{ width: '30%' }}
                options={options}
                expandTrigger="hover"
                placeholder="카테고리"
                onChange={onChange}

                // changeOnselect

            />


        </Fragment>
    )


}

export default CategoryPage;
