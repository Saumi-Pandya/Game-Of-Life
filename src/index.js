import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';


// class which returns individual grid elements(box)
class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

// class representing the overall grid which contains the box elements
class Grid extends React.Component{
  render(){
    const width = (this.props.cols * 15)+1;
    var rowsArr = [];
    var boxClass = "";
    
    for(var i = 0; i<this.props.rows;i++){
      for(var j = 0;j<this.props.cols;j++){
        let boxId = i+ '-'+j;

        boxClass = this.props.gridFull[i][j]?"box on":"box off";
        rowsArr.push(
          <Box
           boxClass = {boxClass}
           key = {boxId}
           boxId = {boxId}
           row = {i}
           col = {j}
           selectBox = {this.props.selectBox} 
           />
        );
      }
    }
    return (
      <div className = "grid" style = {{width : width}}>
        {rowsArr}
      </div>
    );
  }
};

// class to display different buttons on screen
class Buttons extends React.Component {

	handleSelect = (evt) => {
		this.props.gridSize(evt);
	}

	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton} style = {{backgroundColor:'white'}}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton} style = {{backgroundColor:'white'}}>
					  Pause
					</button>
          <button className="btn btn-default" onClick={this.props.clear} style = {{backgroundColor:'white'}}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.seed} style = {{backgroundColor:'white'}}>
					  Seed
					</button>
				</ButtonToolbar>
			</div>
			)
	}
}

// Main class 
class Main extends React.Component{

  constructor(){
    super();
    this.speed = 500;
    this.rows = 30;
    this.cols = 50;
    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
      ,};
  }

  selectBox = (row, col) => {
		let gridCopy = arrayClone(this.state.gridFull);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			gridFull: gridCopy
		});
	}

  seed = () =>{
    let gridCopy = arrayClone(this.state.gridFull);
    for(var i =0;i<this.rows;i++){
      for(var j =0;j<this.cols;j++){
        var temp = Math.random();
        if(temp>0.8)gridCopy[i][j] = !gridCopy[i][j];
      }
    }
    this.setState({
			gridFull: gridCopy
		});
  }

  playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

  pauseButton = () => {
		clearInterval(this.intervalId);
	}

  play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);
    
    // core login of the game
		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}

  clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}



  render(){
    
    return (
      <div>
        <h1>Welcome to the Game Of Life</h1>
        <Buttons
          playButton = {this.playButton}
          pauseButton = {this.pauseButton}
          seed = {this.seed}
          clear = {this.clear}
          />
        <Grid
        gridFull ={this.state.gridFull}
        rows = {this.rows}
        cols = {this.cols}
        selectBox = {this.selectBox}
        />
        <h2>Generations:{this.state.generation}</h2>
        
      </div>
    );
  }

};

// function to create clone of the array
function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
};



ReactDOM.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>,
  document.getElementById('root')
);
