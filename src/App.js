import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Alert, Input, InputNumber, Card, Space,
     Select, Button, Slider, Divider, Image, Spin, Modal, Tag, Layout, Typography} from 'antd';
import './App.css';
import { useForm, Controller } from "react-hook-form";
import ReactPlayer from 'react-player'
import moment from 'moment'
import axios from 'axios';
import { BlockPicker } from 'react-color' 
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import QueueAnim from 'rc-queue-anim';

const { Option } = Select;

const fontsList = [
  'DelaGothicOne-Regular',
  'KiwiMaru-Light',
  'KiwiMaru-Medium',
  'KiwiMaru-Regular',
  'Roboto-Black',
  'Roboto-BlackItalic',
  'Roboto-Bold',
  'Roboto-BoldItalic',
  'Roboto-Italic',
  'Roboto-Light',
  'Roboto-LightItalic',
  'Roboto-Medium',
  'Roboto-MediumItalic',
  'Roboto-Regular',
  'Roboto-Thin',
  'Roboto-ThinItalic',
  'times',
  'TrainOne-Regular',
]

const resList = [
  '480x270', '480x360', '480x480', '480x576', '512x480', '480x720', 
  '544x480', '720x720', '720x480', '720x576'
  /*'640x480', '800x600', '960x720', '960x540', '720x720', '540x960', '512x256',
  '480x320', '640x480', '352x240', '352x288', '352x480', '352x576', '704x480',
  '544x480', '480x576', '176x144', '128x96'*/
]

const initialOptions = {
  "client-id": "AcKnFi6WZvH1TJkryNtD-eHvLIcSlkoB9J7Qyz_z4eohFjdtwN2QUn4PF0Pw_gZ1pb8M2kcAkLAs2Kzj",
  currency: "USD",
  intent: "capture",
};


const { Search } = Input;

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

export default function App() {


  const [video, setVideo] = useState(null);
  const [playing, setPlaying] = useState(0);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [start, setStart] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [textColor, setTextColor] = useState(null);
  const [gifSlider, setGifSlider] = useState(3);
  const [prevSlider, setPrevSlider] = useState(0)

  const [font, setFont] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [fontSize, setFontSize] = useState(null);
  const [text, setText] = useState(null);

  const [timeInput, setTimeInput] = useState('00:00:00')

  const [gif, setGif] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, loadingToggle] = useState(false)

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const refVideo = useRef(null)

  const { control, handleSubmit, formState: { errors } } = useForm();

  useEffect(()=>{
    setFont(fontsList[0])
    setResolution(resList[0])
  },[])
   

  const onSubmit = data => {
    console.log(data);
    loadingToggle(!loading)
    setVideo(data.videoURL)
  }

  const handleShowPicker = () => {
    setShowPicker(!showPicker)
  }

 
  const createGif = async () => {

    if(!video)
    return false;

    loadingToggle(!loading); //

    let duree = moment.utc(gifSlider*1000).format('HH:mm:ss');
    //console.log(duree)
    let _start = start;
    let url = video;
    //console.log(url)


    if(!url){
      loadingToggle(false); //
      return false;
    }else if(url){

      if(Math.ceil(prevSlider) === Math.trunc(duration)){
        refVideo.current.seekTo(parseFloat(0))
        _start = moment.utc(0*1000).format('HH:mm:ss')
        setStart(_start)
        setPrevSlider(0)
      }else if(Math.floor(prevSlider) === Math.trunc(duration)){
        refVideo.current.seekTo(parseFloat(0))
        _start = moment.utc(0*1000).format('HH:mm:ss')
        setStart(_start)
        setPrevSlider(0)
      }
        
      axios.post(`${process.env.REACT_APP_BACKEND}`,
      {
        "url":url,
        "text": text || null,
        "start": _start || "00:00:00",
        "duration": duree || "00:00:03",
        "font": font || null,
        "fontSize": fontSize || null,
        "fontColor": textColor || 'white',
        "resolution": resolution || '400x300'
      }).then(res=>{
        console.log(res);
        if(res.status === 200){

          let _2half = res.data.filename && res.data.filename.substring(1);
          console.log(_2half)

          let s = `${process.env.REACT_APP_BACKEND}${_2half}`;
          setGif(s)
          console.log(s)
          //window.open(res.data.filename)
          loadingToggle(false); //

        }
      }).catch(err=> {
        console.log(err)
    
        loadingToggle(false); //
      }) 

    }
  }
 
  const TimetoSec = (time) => {
    let al = time.match(/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/);
    if(!al)
      return false;
    let a = time.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
  }

  const handleVideoSeek = (val) => {

    console.log(val)
    if(!val)
      return false;
    refVideo.current.seekTo(parseFloat(val))
    let t = moment.utc(val*1000).format('HH:mm:ss');
    setStart(t)
    setTimeInput(t)
    setIsPlaying(true)
  }

  const youtube_parser = (url) => { 
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*|^(?:(?:https?:)?\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9\.]+\/videos\/(?:[a-zA-Z0-9\.]+\/)?([0-9]+)/;
    var match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
  }
  
  // 
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: +"Gifkur Premium (remove Watermark)",
          amount: {
            currency_code: "USD",
            value: 200
          }
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log("Payment Approved: ", paymentData);
      //this.setState({ showButtons: false, paid: true });
    });
  };


  return (
  <Layout>

  <Header style={{color:'white'}}>Gifkur.com  </Header>

  <Spin tip='Loading...' size='large' spinning={loading}>
  <Content>
    <Row>
      <Col  xs={1} sm={1} md={3} lg={3} xl={3}>
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
                  onSearch={handleSubmit(onSubmit)}
                /> }
            />


              {errors.videoURL && 
                <Alert
                  message="Warning"
                  description="A valid Video URL is required !"
                  type="warning"
                  showIcon
                />
              }

              </Row>

              <QueueAnim type={['right', 'left']}>
              {video && 

              <Row key='rrow'> 


                <Col key='col01' xs={24} sm={24} md={16} lg={16} xl={16}>
                  <Card key='01' style={{height:'100%'}}>
 
                  {video && 
                    <ReactPlayer 
                      key='videoPlayer01'
                      url={video} 
                      onDuration={setDuration}
                      onPlay={()=>{
                        setPlaying(true)
                      }}
                      onPause={()=>{
                        setPlaying(false)
                      }}
                      onReady={()=>loadingToggle(!loading)}
                      ref={refVideo}
                      controls={true}
                      width='100%'
                      style={{padding:'0em 0em 2em 0em'}}
                      onSeek={e => console.log('onSeek', e)}
                      onError={e => console.log('onError', e)}
                      onProgress={e => {

                        setPlayed(e.played)
                        let t = moment.utc(e.playedSeconds*1000).format('HH:mm:ss')
                        setStart(t)
                        setTimeInput(t)
                        setPrevSlider(e.playedSeconds)
                      }}
                      playing={isPlaying}
                    />
                  }
 
                    { gif &&
                      <>
                      <Image
                        height={300}
                        src={gif}
                        fallback="data:image/png;base64,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"
                      />
                      <Button type="primary" onClick={()=> window.open(gif)} block>
                        Download GIF
                      </Button>
                      </>
                    }

                  </Card>
                
                </Col>

                <Col key='col02' xs={24} sm={24} md={8} lg={8} xl={8}>
                  
                  <Space key='s02' direction="vertical" size={1}  style={{width:'100%'}}>
                  <Card key='02'>
                    <Title level={5}>Duration</Title>
                    <Slider defaultValue={3} min={1} max={10} step={1} 
                            tooltipVisible onChange={setGifSlider} value={gifSlider}/>
                            
                    <Title level={5}>Start Time 
                      &nbsp;&nbsp;
                      <Tag color="magenta">
                      {moment.utc((duration * played)*1000).format('HH:mm:ss')}
                      </Tag>
                    </Title>

                    <Slider defaultValue={0} max={duration} value={prevSlider} step={1}
                        tooltipVisible={false} onAfterChange={handleVideoSeek} onChange={setPrevSlider}   />
 
                    <Input 
                        value={timeInput} 
                        onChange={e => {
                          setTimeInput(e.target.value)
                          if(video){
                            handleVideoSeek(TimetoSec(e.target.value))
                          }
                          }
                        }/>

                  </Card>
                  
                  <Card key='03'>
                    <br />
                      <Title level={5}>Text</Title>
                      <Input style={{ width: '50%' }} placeholder="enter text here..."
                              value={text} onChange={e => setText(e.target.value)}/>
                      <Button style={{backgroundColor:textColor}} onClick={handleShowPicker}>Color</Button>
                      { showPicker &&
                        <BlockPicker onChange={e=>setTextColor(e.hex)} onChangeComplete={handleShowPicker}/>
                      }
         
                      
                    <br />
                    <br />      
                      <Title level={5}>Font-family & size</Title>
                      <Input.Group compact>
                        <Select  value={font}  onChange={setFont}>
                          { fontsList && 
                            fontsList.map((el, i) => {
                              return  <Option value={el} key={i}>{el}</Option>
                            })
                          }
                        </Select>
                          <InputNumber size='middle' min={8} max={500} defaultValue={32} value={fontSize} onChange={setFontSize} />
                      </Input.Group>

                    <br />      
                    
                      <Title level={5}>GIF resolution</Title>
                        <Select  value={resolution}   onChange={setResolution}>
                          { resList && 
                            resList.map((el, i) => {
                              return  <Option value={el} key={i}>{el}</Option>
                            })
                          }
                        </Select>
                    <br />
                    </Card>

  

                    <Card key='04'>
                    <Title level={5}>State</Title>
                    <table>
                      <tbody>

                        <tr>
                          <th>playing</th>
                          <td>{playing ? 'true' : 'false'}</td>
                        </tr>

                        <tr>
                          <th>duration</th>
                          <td>  {moment.utc(duration*1000).format('HH:mm:ss')}  </td>
                        </tr>
                        <tr>
                          <th>elapsed</th>
                          <td>  {moment.utc((duration * played)*1000).format('HH:mm:ss')} </td>
                        </tr>
                        <tr>
                          <th>remaining</th>
                          <td>  {moment.utc((duration * (1 - played))*1000).format('HH:mm:ss')} </td>
                        </tr>
                      </tbody>
                    </table>
                    </Card>
  
                    <Card key='05'>
                      <Button type="primary" onClick={createGif} block danger>
                        Create GIF
                      </Button>
                      <br />
                      <br />
                      <Button type="primary" onClick={showModal} block>
                        Buy Premium
                      </Button>
                    </Card>

                    </Space>

                </Col>

              </Row>
               }

              </QueueAnim>

      </Col>
      <Col xs={1} sm={1} md={3} lg={3} xl={3}>
      </Col>
    </Row>
    <Row>
      <Col span={3}></Col>
      <Col span={18}>

        <Modal title="Premium - remove watermark" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons 
 
            />
          </PayPalScriptProvider>
        </Modal>

      </Col>
      <Col span={3}></Col>
    </Row>
  </Content>
  </Spin>

  <Footer style={{ textAlign: 'center' }}>
    <p>All right reserver (c) 2021 - Gifkur.com</p>
    <p><a href='mailto:mokhtar.developer@gmail.com'>mokhtar.developer@gmail.com</a></p>
    </Footer>

</Layout>



  );
}