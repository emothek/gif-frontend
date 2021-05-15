import React, { useState, useEffect } from 'react'
import { Row, Col,  Input,  Tag,
      Spin,   Layout, Typography, Divider} from 'antd';

import InfiniteScroll from 'react-infinite-scroll-component';

import axios from 'axios'

import { useForm, Controller } from "react-hook-form";


const { Search } = Input;
const { Header, Footer, Content } = Layout;
const { Title } = Typography;

export default function Home () {
    const [loading, loadingToggle] = useState(false)

    const [items, setItems] = useState([])
    const [rows, setRows] = useState([])
    
    const { control, handleSubmit, formState: { errors } } = useForm();

    useEffect(()=>{
        fetchData()
    }, [])

    const fetchData = () => {
 
      axios.get(`${process.env.REACT_APP_BACKEND}/gif/query?limit=10&skip=0`,
      {
        params:{
            category: 'gaming',
            tags: 'space'
        }
      }).then(res=>{
        console.log(res);
        if(res.status === 200){
            setItems(res.data)
            setRows(new Array(Math.ceil(res.data.length / 4)))
        }
      }).catch(err=> {
        console.log(err)
    
      }) 
    }

    return(
        <Layout>

        <Spin tip='Loading...' size='large' spinning={loading}>
        <Content>
            <Row>
            <Col  xs={1} sm={1} md={3} lg={3} xl={3}>
                {/*Home page - {JSON.stringify(rows)}*/}
            </Col>
            <Col  xs={22} sm={22} md={18} lg={18} xl={18}>
        

            <Row>
            <Controller
              name="videoURL"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: {
                  value: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*|^(?:(?:https?:)?\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9\.]+\/videos\/(?:[a-zA-Z0-9\.]+\/)?([0-9]+)/,
                  message: 'invalid video URL'
                }
              }}
              render={({ field }) => 
                <Search
                  placeholder="input search text"
                  allowClear
                  style={{margin:'2em 0'}}
                  enterButton="Get video"
                  size="large"
                  {...field} 
                  //onSearch={handleSubmit(onSubmit)}
                /> }
            />
            </Row>

                <InfiniteScroll
                    dataLength={items.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={true}
                    style={{
                        overflowY: 'auto !important',
                        overflowX: 'hidden !important'
                    }}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                        </p>
                    }
                    // below props only if you need pull down functionality
                    /*refreshFunction={refresh}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                    }*/
                    >
                        {rows.fill('').map((_, i)=>{
                            return(
                                <Row gutter={[16, 16]} key={i} 
                                    style={{padding:'2em', 
                                    justifyContent:'center'}}>
                                    
                                    {items.slice( i*4, (i+1)*4).map((el, index) => {
                                        console.log(el.url)
                                        if(!el.url){
                                            /*return (
                                                <Col span={6} key={index}></Col>
                                            )*/
                                        }else{   
                                            return (
                                                <Col span={6} key={index}  
                                                    style={{
                                                        borderRadius: '0.5em',
                                                        padding:'0.5em',
                                                        margin:'0.5em',
                                                        background:'linear-gradient(45deg, rgb(230, 70, 182) 0%, rgb(97, 87, 255) 100%)'}}>
                                                    <div style={{background:`url('${el.url}')`, height:'10em'}}>

                                                    </div>
                                                    <Divider style={{ margin: '10px 0'}} />
                                                   
                                                    <Tag color='magenta'>{el.category}</Tag> 
                                                    <br></br>
                                                    {
                                                        el.tags && el.tags.map((em, x)=>{
                                                            return(
                                                                <Tag color='geekblue' key={x}>
                                                                {em}
                                                                </Tag>
                                                            )
                                                        })
                                                    }
                                                </Col>
                                            )
                                        }
                                    
                                    })}
                                </Row>
                            )
                        })}

                </InfiniteScroll>
 

            </Col>
            </Row>
        </Content>
        </Spin>
        </Layout>
    )
}