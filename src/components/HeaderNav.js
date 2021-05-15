import React from 'react'
import { Layout } from 'antd';

const { Header } = Layout;


export default function HeaderNav () {
    return(
        <Header style={{height:'80px', textAlign:'center'}}>
            <div class='logo'>Gifwif.com</div>
        </Header>
    )
}