import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


export interface IAppProps {
}

export interface IAppState {
  DataisLoaded: boolean,
  items?: { records: [] }
}

export default class App extends React.Component<IAppProps, IAppState> {

  state: IAppState = {
    DataisLoaded: false
  };

  componentDidMount() {
    fetch(
      "/covid19/casedistribution/json")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json,
          DataisLoaded: true
        });
        console.log(json);
      })
  }

  render() {
    const { DataisLoaded, items } = this.state;
    if (!DataisLoaded) return <div>
      <h1> Pleses wait some time.... </h1> </div>;

    return (
      <div className="App">
        <h1> Fetch data from an api in react </h1>  {
          items?.records.map((item: { cases: number }, id) => (
            <ol key={id}>
              {item.cases}
            </ol>
          ))
        }
      </div>
    );
  }
}
