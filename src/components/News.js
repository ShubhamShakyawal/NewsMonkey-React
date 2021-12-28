import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    };
    document.title = `${this.capitaliseFirstLetter(this.props.category)} - NewsMonkey`;
  }

  capitaliseFirstLetter = (string)=>{
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async componentDidMount() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    });
    this.props.setProgress(100);
  }

  fetchMoreData= async()=>{
   
      this.setState({page: this.state.page + 1});
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${
        this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults
      });
      
  }

  render() {
    return (
      <>
          <h1 className="text-center" style={{margin: '35px'}}>NewsMonkey - Top {this.capitaliseFirstLetter(this.props.category)} Headlines</h1>
          {this.state.loading && <Spinner/>}
          <InfiniteScroll
                dataLength={this.state.articles.length} //This is important field to render the next data
                next={this.fetchMoreData}
                hasMore={this.state.articles.length !== this.state.totalResults}
                loader={<Spinner/>}
          >  
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title} description={element.description} author={element.author} date={element.publishedAt}
                      imageUrl={element.urlToImage} newsUrl={element.url} source={element.source.name}   />
                  </div>
                );
              })}
            </div>
          </div>     
          </InfiniteScroll>
      </>
    );
  }
}

export default News;
