import React from 'react';
import axios from 'axios';
import { Jumbotron, Container, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import style from './style.scss';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search : '',
			data : [],
			img : { 
				title : [],
				href : []
			},
			img2 : { 
				title : [],
				href : []
			},
			nimg : {
				title : [],
				href : [],
			},
			modal: false
		};
		this.toggle = this.toggle.bind(this);
    }

	toggle() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
  	}
	
	componentDidMount() {
		axios.get('/api/account/favorup')
		.then(data => { 
			this.handleImg(data.data.data[0].favorite);
		})
		.catch(function(err) {
			console.log(err);
		})
	}
	
	
	handleImg = (data) => {
		var count = 0;
		var rdata = data.reverse();
		data.forEach((ele) => {
			console.log(ele);
			count++;
			if(count % 2 != 0){
				this.setState({
					img : {
						title : this.state.img.title.concat(ele.title),
						href : this.state.img.href.concat(ele.href)
					}
				})
			}
			else {
				this.setState({
					img2 : {
						title : this.state.img2.title.concat(ele.title),
						href : this.state.img2.href.concat(ele.href)
					} 
				})
			}			
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
		
		return (
			<div>
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
				<div>
					<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
						<ModalHeader toggle={this.toggle}>{this.state.nimg.title}</ModalHeader>
						<ModalBody>
							<img  className={style.img} src={this.state.nimg.href} ></img>
						</ModalBody>
						<ModalFooter>
							<a href={this.state.nimg.href} download>Click to download</a>
							<Button color="primary" onClick={this.favorin}> 즐겨찾기 </Button>{' '}
							<Button color="secondary" onClick={this.toggle}>종료</Button>
						</ModalFooter>
					</Modal>
				</div>
			</div>
		);
	}
}

export default Search;


