import React from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem, InputGroup,Input,  Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';
import style from './style.scss';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search : '',
			data : [],
			img : { 
				title : [
					'Earth Observations taken by the Expedition 10 crew',
					'Earth Observation taken during the Expedition 37 mission',
					'Tropical Storm Dianmu'
				],
				href : [ 
					'http://images-assets.nasa.gov/image/iss010e12103/iss010e12103~orig.jpg',
					'http://images-assets.nasa.gov/image/iss037e005370/iss037e005370~orig.jpg',
					'http://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002003/GSFC_20171208_Archive_e002003~orig.jpg'			
				]
			},
			img2 : { 
				title : [
					'Soyuz docked on ISS',
					'Earth Observations taken by Expedition 38 crewmember',
				],
				href : [ 
					'http://images-assets.nasa.gov/image/iss040e005997/iss040e005997~orig.jpg',
					'http://images-assets.nasa.gov/image/iss038e038300/iss038e038300~orig.jpg',
				]
			},
			nimg : {
				title : [],
				href : [],
			},
			userId : '',
			modal: false
		};
		this.toggle = this.toggle.bind(this);
    }

	componentDidMount() {
		axios.get('/api/account/id').then(({ data }) => {
			this.setState({
				userId: data
			});
		});
	}
	
	toggle() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
  	}
	
	handleChange = (e) => {
		this.setState({
			search: e.target.value
		})
	}
	
	handleSearch = () => {
		const url = `https://images-api.nasa.gov/search?q=${this.state.search}`
		axios.get(url)
		.catch(function(err) {
			console.log(err.response.status);
			if(err.response.status == 400){
				alert('Bad Requst');
			}else if( err.response.status == 404){
				alert('Not Found');
			}else {
				alert('server Error');
			}
			
		})
		.then(data => { 
			console.log(data);
			this.setState({
				data : data.data.collection.items,
				img : { 
					title : [],
					href : []
				},
				img2 : { 
					title : [],
					href : []
				},
			})
			this.handleImg(this.state.data);
		})
	}
	
	handleImg = (data) => {
				
		var count = 0;
		data.forEach((ele) => {
		
			axios.get(ele.href)
			.catch( err => { console.log(err)} )
			.then( img => {
				count++;
				if(count % 2 != 0){
					this.setState({
						img : {
							title : this.state.img.title.concat(ele.data[0].title),
							href : this.state.img.href.concat(img.data[0])
						}
					})
				}
				else {
					this.setState({
						img2 : {
							title : this.state.img2.title.concat(ele.data[0].title),
							href : this.state.img2.href.concat(img.data[0])
						} 
					})
				}

			})
		})
		
	}
	
	favorin = () => {
		const { title, href } = this.state.nimg;
		axios
			.post('/api/account/favorin', { title, href })
			.then(({ data }) => {
				console.log(data);
			})
			.catch(err => {
				this.setState({ errorMsg: getErrorMsg(err.response.status) });
			});
	}
	
	render() {
		const imgclick1 = (index) => {
			this.setState({
				nimg :  {
					title : this.state.img.title[index],
					href : this.state.img.href[index]
				},
				modal : !this.state.modal 
			})
		}
		const imgclick2 = (index) => {
			this.setState({
				nimg :  {
					title : this.state.img2.title[index],
					href : this.state.img2.href[index]
				},
				modal : !this.state.modal 
			})
		}
		const imglist = this.state.img.href.map(  
			(img, index) => ( 
					<img key={index} className={style.img} src={img} onClick={ () => imgclick1(index)} ></img>
				)
		);
		const imglist2 = this.state.img2.href.map(  
			(img2, index) => ( 
					<img key={index} className={style.img} src={img2} onClick={ () => imgclick2(index)}></img>
				)
		);
		const { userId } = this.state;
		const { title } = this.state.img;
		return (
			<div> 
				<div className={style.search}>
					<div className={style.search_content}>
						<h1 className={style.h1} >NASA Search Web </h1>
						<div>나사에서 제공되는 이미지를 무료로 살펴보세요</div>
						<InputGroup className ={style.search_box}>
							<Input className={"width: 10rem"} onChange={this.handleChange}  value= {this.state.search} />
							<button  type="button" onClick={this.handleSearch} > 검색 </button>
						</InputGroup>
					</div>
				</div>
				{	
					title.length ==0	?
					<div className={style.thumnails}>
						<div className={style.no_thumnails_content}>
							<h1>죄송합니다. 검색결과가 없습니다.</h1>
							<div>
								<div>맞춤법이 올바른지 확인해주세요.</div>
								<div>언어는 영어만 가능해요.</div>
								<div>동의어 또는 일반적인 용어를 사용하세요.</div>
							</div>
						</div>
					</div>
					:
					<div className={style.thumnails} >
						<div className={style.thumnails_content}>
							<div className={style.imglist}>
								{imglist}
							</div>
							<div className={style.imglist}>
								{imglist2}
							</div>
						</div>
					</div>
					
				}
				<div style={{maxWidth: '1200px', width: '95%', margin : 'auto'}}>
					<Modal isOpen={this.state.modal} toggle={this.toggle} style={{maxWidth: '1000px', width: '95%', marginTop : '5rem', marginBottom: '5rem',  textAlign: 'center'}}>
						<ModalHeader toggle={this.toggle}>{this.state.nimg.title}</ModalHeader>
						<ModalBody>
							<img  className={style.img} src={this.state.nimg.href} ></img>
						</ModalBody>
						<ModalFooter>  
							{
								userId == '' ?
								<Button color="secondary" onClick={this.toggle}>종료</Button>
								:
								<div>
									<a href={this.state.nimg.href} download>Click to download</a>
									<Button color="primary" onClick={this.favorin}> 즐겨찾기 </Button>{' '}
									<Button color="secondary" onClick={this.toggle}>종료</Button>
								</div>
							}
							
						</ModalFooter>
					</Modal>
			    </div>
			</div>
			
		);
	}
}

export default Search;