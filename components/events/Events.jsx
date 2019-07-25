import * as React from 'react';
import './Events.css';
// import Event from './event/Event'
import { db } from '../../src/firebase/firebaseSetup.js';
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid, Tabs, Tab } from '@material-ui/core';
import Event from './event/Event'

const styles = style => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: style.spacing.unit * 2,
  },
  tabs: {
    marginBottom: '20px',
  },
  indicator: {
    display: 'none',
  },
  futureTab: {
    borderRadius: "30px 0px 0px 30px",
    backgroundColor: '#f0efef',
  },
  selectedFuture: {
    backgroundColor: '#f9b625',
    color: '#f0efef',
  },
  pastTab: {
    borderRadius: "0px 30px 30px 0px",
    backgroundColor: '#f0efef',
  },
  selectedPast: {
    backgroundColor: '#f9b625',
    color: '#f0efef',
  },
});

class Events extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      past: [],
      future: [],
      showPast: false,
      tab: 0,
      showEvent: false,
      eventID: '',
      loading: true,
    };

    db.collection('events').get().then(((querySnapshot) => {
      // TODO: add movement filter
      let data = [];
      let past = [];
      let future = [];
      let now = moment().format('X');
      querySnapshot.forEach((doc) => {
        let info = doc.data();
        let temp = {
          id: doc.id,
          name: info.name,
          description: info.description,
          image: info.imageLink,
          start: info.startDate.seconds,
          end: info.endDate.seconds,
          location: info.location,
          url: info.url,
          movements: info.movements,
        };
        if (temp.end > now || temp.start > now) {
          future.push(temp);
        } else {
          past.push(temp);
        }
      });
      this.setState({
        past: past,
        future: future,
        loading: false,
      });
    }).bind(this));
  }

  showEvent(id) {
    this.setState({
      showEvent: true,
      eventID: id,
    });
  }

  tabChange = (event, tab) => {
    if (tab == 1) {
      this.setState({
        showPast: true,
        tab,
      });
    } else {
      this.setState({
        showPast: false,
        tab,
      });
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    if (this.state.showPast) {
      data = this.state.past.map((event) => (
        (<Grid item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <Event key={event.id} event={event} />
      </Grid>)));
    } else {
      data = this.state.future.map((event) => (
        (<Grid item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <Event key={event.id} event={event} />
      </Grid>)));
    }

    return (
      <div>
        <Tabs
          classes={{
            indicator: classes.indicator,
            root: classes.tabs,
          }}
          value={this.state.tab}
          onChange={this.tabChange}
          textColor='inherit'
          centered
        >
        <Tab label='Upcoming' classes={{
          root: classes.futureTab,
          selected: classes.selectedFuture,
          }}/>
        <Tab label='Past' classes={{
          root: classes.pastTab,
          selected: classes.selectedPast,
          }}/>
      </Tabs>
      <Grid container spacing={24} component={'div'} direction={'row'}>
        {this.state.loading ? loading : data}
      </Grid>
      </div>

    );
  }
}

export default withStyles(styles)(Events);