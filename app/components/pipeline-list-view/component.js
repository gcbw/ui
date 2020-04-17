import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import moment from 'moment';
import Table from 'ember-light-table';

export default Component.extend({
  init() {
    this._super(...arguments);

    this.get('updateListViewJobs')();
  },
  table: null,
  columns: [
    {
      label: 'JOB',
      valuePath: 'job',
      cellComponent: 'pipeline-list-job-cell'
    },
    {
      label: 'HISTORY',
      valuePath: 'history',
      cellComponent: 'pipeline-list-history-cell'
    },
    {
      label: 'DURATION',
      valuePath: 'duration'
    },
    {
      label: 'START TIME',
      valuePath: 'startTime'
    },
    {
      label: 'COVERAGE',
      valuePath: 'coverage'
    },
    {
      label: 'ACTIONS',
      valuePath: 'actions',
      cellComponent: 'pipeline-list-actions-cell'
    }
  ],
  rows: computed('jobsDetails', {
    get() {
      return this.jobsDetails.map(jobDetails => {
        const latestBuild = jobDetails.builds.length ? jobDetails.builds[0] : null;
  
        const jobData = {
          jobName: jobDetails.jobName,
          build: latestBuild
        };
  
        const actionsData = {
          jobId: jobDetails.jobId,
          jobName: jobDetails.jobName,
          latestBuild,
          startSingleBuild: this.get('startSingleBuild'),
          stopBuild: this.get('stopBuild')
        };
  
        let startDateTime;
        let endDateTime;
        let startTime;
        let status;
  
        if (latestBuild) {
          startDateTime = Date.parse(jobDetails.builds[0].startTime);
          endDateTime = Date.parse(jobDetails.builds[0].endTime);
          startTime = moment(jobDetails.builds[0].startTime).format('lll');
          status = latestBuild.status;
        }
        
        return {
          job: jobData,
          startTime: startTime === 'Invalid date' ? 'Not started.' : startTime,
          duration: this.getDuration(startDateTime, endDateTime, status),
          history: jobDetails.builds,
          actions: actionsData
        };
      });
    }
  }),
  // test: observer('jobsDetails', 'jobsDetails.@each.builds', function() {
  //   const rows = [];

  //   this.jobsDetails.forEach(jobDetails => {
  //     const latestBuild = jobDetails.builds.length ? jobDetails.builds[0] : null;

  //     const jobData = {
  //       jobName: jobDetails.jobName,
  //       build: latestBuild
  //     };

  //     const actionsData = {
  //       jobId: jobDetails.jobId,
  //       jobName: jobDetails.jobName,
  //       latestBuild,
  //       startSingleBuild: this.get('startSingleBuild'),
  //       stopBuild: this.get('stopBuild')
  //     };

  //     let startDateTime;
  //           let endDateTime;
  //           let startTime;
  //           let status;

  //     if (latestBuild) {
  //       startDateTime = Date.parse(jobDetails.builds[0].startTime);
  //       endDateTime = Date.parse(jobDetails.builds[0].endTime);
  //       startTime = moment(jobDetails.builds[0].startTime).format('lll');
  //       status = latestBuild.status;
  //     }

  //     rows.push({
  //       job: jobData,
  //       startTime: startTime === 'Invalid date' ? 'Not started.' : startTime,
  //       duration: this.getDuration(startDateTime, endDateTime, status),
  //       history: jobDetails.builds,
  //       actions: actionsData
  //     });
  //   });
  //   this.get('table').setRows(rows);
  // }),
  table: computed('rows', {
    get() {
      console.log('new table');
      return new Table(this.get('columns'), this.get('rows'));
    }
  }),
  getDuration(startDateTime, endDateTime) {
        if (!startDateTime) {
            return null;
        }
        if (!endDateTime) {
            return 'Still running.';
        }

        const duration = endDateTime - startDateTime;

        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? '0'.concat(hours) : hours;
        minutes = minutes < 10 ? '0'.concat(minutes) : minutes;
        seconds = seconds < 10 ? '0'.concat(seconds) : seconds;

        // eslint-disable-next-line prefer-template
        return hours + 'h ' + minutes + 'm ' + seconds + 's';
  },
  actions: {
    onScrolledToBottom() {
      this.get('updateListViewJobs')();
    },
    refreshListViewJobs() {
      this.get('refreshListViewJobs')();
    }
  }
});
