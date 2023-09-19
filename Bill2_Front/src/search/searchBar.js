import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import './searchBar.css'
import search from "./search";
import {Button} from "antd";
import {SearchOutlined} from "@ant-design/icons";

function SearchBar() {
    //store에 저장할 검색어 값

    const dispatch = useDispatch();
    const navi =useNavigate();

    //store에 저장된 검색어 값
    const text = useSelector(state => state.searchText);

    const [searchText, setSearchText] = useState('');

    useEffect(()=>{
        setSearchText(text);
    }, [text])


    const onChange= (e) => {
        console.log(e.target.value)
        setSearchText(e.target.value)
    }


    const onSubmit = (e) => {
        dispatch({type: "SEARCH_TEXT", payload: searchText})
        navi('/search')
    }

    return(
        <div>
            <fieldset>
                <form >
                    <legend className="visually-hidden"/>
                    <div className="search_box">
                        <input
                            className="searchInput"
                            type="text"
                            maxLength="225"
                            tabIndex="1"
                            placeholder="물품명을 검색해보세요!"
                            onChange={onChange}
                            value={searchText}/>
                        <Button className="searchBox" tabIndex="2" onClick={onSubmit}  icon={<SearchOutlined />}>
                        </Button>

                    </div>
                </form>
            </fieldset>
        </div>

    )
}

export default SearchBar;