const DetailsView = {
  template: `
  <div class="container">

    <div class="row">
        <h5>Details of {{ getCurrentDocument().name }}</h5>
    </div>

    <div class="row">
        <div class="card card-body">
            <div class="row">
                <div class="col-sm-4">
                    <h4 class="card-title text-center">Plagiarism <b> {{ plagPercent() }} %</b></h4>
                    <canvas id="collPie"></canvas> 
                </div>
                <div class="col-sm-8">
                    <div class="col-sm-12">                    
                        <div class="progress" style="height: 64px;">
                        <div class="progress-bar" role="progressbar" v-bind:style="{width: numUniqueChunks() + '%'}" aria-valuenow="numUniqueChunks()()" aria-valuemin="0" aria-valuemax="numTotalChunks()"></div>
                        <div class="progress-bar bg-success" role="progressbar" v-bind:style="{width: numTemplateChunks() + '%'}" aria-valuenow="numTemplateChunks()" aria-valuemin="0" aria-valuemax="numTotalChunks()"></div>
                        <div class="progress-bar bg-danger" role="progressbar" v-bind:style="{width: numColChunks() + '%'}" aria-valuenow="numColChunks()" aria-valuemin="0" aria-valuemax="numTotalChunks()"></div>                                         
                        <!--- <span class="lead">{{ getCurrentDocName() }}</span> -->
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4">
                            <h5 class="card-title text-center"> Unique Chunks</h5>
                            <p class="display-4 text-center">{{ numUniqueChunks() }}</p>
                        </div>

                        <div class="col-sm-4">
                            <h5 class="card-title text-center">Template Chunks</h5>
                            <p class="display-4 text-center">{{ numTemplateChunks() }}</p>
                        </div>

                        <div class="col-sm-4">
                            <h5 class="card-title text-center" text-center>Collisions</h5>
                            <p class="display-4 text-center">{{ numColChunks() }}</p>
                        </div>  
                    </div>                    

                </div>
            </div>
  
        </div>
    </div>

    <!---
    <div class="row">
        <div class="col-sm-12" v-for="(value, index) in getSortedKeys(getCurrentDocument().collRelations).slice(0, 5)">                              
                {{getCurrentDocument().name | firstWord}},{{value | firstWord}},{{getPartnerPercent(getCurrentDocument().collRelations[value])}}
        </div>                                    
    </div>
    -->

    <div class="row">
        <div class="card card-body">
            <div class="row">
                <div class="col-sm-6">
                     
                    <!-- <p class="display-4">{{ numColChunks() }}</p> -->
                    <h5 class="card-title text-center">Radar Graph</h5>
                    <canvas id="collRadar"></canvas> 
                </div>            
                <div class="col-sm-6">
                    <h5 class="card-title text-center">Top Partners</h5>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Collision %</th>
                                <th>Name</th>
                            </tr>
                        </thead>

                        <tbody>
                        <tr v-for="(value, index) in getSortedKeys(getCurrentDocument().collRelations).slice(0, 5)">                              
                            <td>{{ getPartnerPercent(getCurrentDocument().collRelations[value])}} %</td>
                            <td>{{value | subStr}}</td>                                
                        </tr>                                    
                        </tbody>
                    </table>                
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-header">
                    <b>Partners Network</b>
                    <button class="btn btn-link float-right" type="button" data-toggle="collapse" data-target="#collapseNetworkTable" aria-expanded="true" aria-controls="collapseNetworkTable">
                        Collapse
                    </button>
                </div>
                <div class="collapse multi-collapse" id="collapseNetworkTable">
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Partner Name</th>
                                    <th>Collision %</th>
                                    <th>Collisions</th>
                                </tr>
                            </thead>

                            <tbody>
                              <tr v-for="(value, index) in getSortedKeys(getCurrentDocument().collRelations)">                              
                                <td scope="row">{{index}}</th>
                                <td>{{value}}</td>                                
                                <td>{{ getPartnerPercent(getCurrentDocument().collRelations[value])}} %</td>
                                <td>{{getCurrentDocument().collRelations[value]}}</td>
                              </tr>                                    
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-header">
                    <b>Clean Text</b>
                    <button class="btn btn-link float-right" type="button" data-toggle="collapse" data-target="#collapseCleanText" aria-expanded="true" aria-controls="collapseCleanText">
                        Collapse
                    </button>
                </div>
                <div class="collapse multi-collapse" id="collapseCleanText">
                    <div class="card-body">
                        <p class="card-text">{{ getCurrentDocument().cleanText }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="row">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-header">
                    <b>Collision Table</b>
                    <button class="btn btn-link float-right" type="button" data-toggle="collapse" data-target="#collapseCollisionTable" aria-expanded="true" aria-controls="collapseCollisionTable">
                        Collapse
                    </button>
                </div>
                <div class="collapse multi-collapse" id="collapseCollisionTable">
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th># Hash</th>
                                    <th>Text Chunk</th>
                                    <th>Relations</th>
                                    <th>Collision %</th>
                                    <th>Partners</th>
                                </tr>
                            </thead>

                            <tbody>
                              <tr v-for="(text, hash) in getCurrentDocument().collisionDict">                                            
                                <td scope="row">{{hash}}</th>
                                <td>{{text}}</td>
                                <td>{{getPartnersNumber(getCurrentDocument(), hash)}}</td>
                                <td>{{getChunkCollPercent(getCurrentDocument(), hash)}} %</td>
                                <td>{{getPartners(getCurrentDocument(), hash)}}</td>                                           
                              </tr>                                    
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
  </div>`,
  mounted() {
    this.createChart("collPie", this.pieData);
    this.createChart("collRadar", this.radarData);
  },
  data() {
    return {
      pieData: this.getPieData(),
      radarData: this.getRadarData(),
    };
  },
  methods: {
    getSortedKeys(obj) {
      var keys = (keys = Object.keys(obj));
      return keys.sort(function (a, b) {
        return obj[b] - obj[a];
      });
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    getSortbyValue(obj) {
      var entries = Object.entries(obj);

      return entries.sort(function (a, b) {
        return b[1] - a[1];
      });
    },
    getRadarData() {
      var array = this.getSortbyValue(this.getCurrentDocument().collRelations);
      array = array.slice(0, 5);

      //split array by column
      var bufLabelArray = array.map(function (row) {
        return row[0].substring(0, 10);
      });
      var bufDataArray = array.map((row) => {
        return (row[1] * 100) / this.numColChunks();
      });

      var ret = {
        type: "radar",
        data: {
          labels: bufLabelArray,
          datasets: [
            {
              label: "Data One",
              data: bufDataArray,
              backgroundColor: [
                "rgba(216,57,76,0.6)", // red
              ],
              borderWidth: 3,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          scale: {
            ticks: {
              min: 0,
              max: 100,
            },
          },
        },
      };

      return ret;
    },
    getPieData() {
      var bufArray = [];
      bufArray.push(this.numUniqueChunks());
      //bufArray.push(0);
      bufArray.push(this.numColChunks());

      var ret = {
        type: "doughnut",
        data: {
          //labels: ['Unique', 'Template', 'Collision'],
          datasets: [
            {
              label: "Data One",
              data: bufArray,
              backgroundColor: [
                "rgba(32,121,248,0.8)", // blue
                //"rgba(48,166,64,0.8)", // green
                "rgba(216,57,76,0.8)", // red
              ],
              borderWidth: 3,
            },
          ],
        },
        options: {},
      };

      return ret;
    },
    getRouteId() {
      return this.$route.params.id;
    },
    getCurrentDocument() {
      return this.$store.state.documents[this.getRouteId()];
    },
    getCurrentDocName() {
      return this.$store.state.documents[this.getRouteId()].name;
    },
    getPartnersNumber(doc, hash) {
      var filteredArray = this.$store.state.collisions[hash].filter(function (
        e
      ) {
        return e !== doc.name;
      });
      return Object.keys(filteredArray.slice(1)).length;
    },
    getPartners(doc, hash) {
      var filteredArray = this.$store.state.collisions[hash].filter(function (
        e
      ) {
        return e !== doc.name;
      });
      return filteredArray.slice(1);
    },
    getPartnerPercent(value) {
      return parseInt((value * 100) / this.numColChunks());
    },
    getChunkCollPercent(doc, hash) {
      return parseInt(
        (this.getPartnersNumber(doc, hash) * 100) /
          Object.keys(this.$store.state.documents).length
      );
    },
    numUniqueChunks() {
      var currentDoc = this.getCurrentDocument();
      return Object.keys(currentDoc.uniqueDict).length;
    },
    numColChunks() {
      var currentDoc = this.getCurrentDocument();
      return Object.keys(currentDoc.collisionDict).length;
    },
    numTemplateChunks() {
      var currentDoc = this.getCurrentDocument();
      return Object.keys(currentDoc.templateDict).length;
    },
    numTotalChunks() {
      return (
        this.numUniqueChunks() + this.numTemplateChunks() + this.numColChunks()
      );
    },
    plagPercent() {
      return parseInt(
        (this.numColChunks() * 100) /
          (this.numTotalChunks() - this.numTemplateChunks())
      );
    },
    getDocCollPercent() {
      return parseInt((this.numColChunks() * 100) / this.numTotalChunks());
    },
    getDocUniquePercent() {
      return parseInt((this.numUniqueChunks() * 100) / this.numTotalChunks());
    },
    getDocTemplatePercent() {
      return parseInt((this.numTemplateChunks() * 100) / this.numTotalChunks());
    },
    getCollColor() {
      var percent = this.getDocCollPercent();

      if (percent < 50) {
        return "#147FFB";
      } else if (percent < 80) {
        return "#FECD51";
      } else if (percent >= 80) {
        return "#DA3748";
      }
      return "";
    },
    getStateIcon() {
      var currentDoc = this.getCurrentDocument();

      if (currentDoc.state == 0) {
        return "cloud_queue";
      } else if (currentDoc.state == 1) {
        return "cloud_upload";
      } else if (currentDoc.state == 2) {
        return "cloud";
      } else if (currentDoc.state == 3) {
        return "cloud_download";
      } else if (doc.state == 4) {
        return "cloud_done";
      }
      return "";
    },
  },
  filters: {
    trim: function (string) {
      return string.trim();
    },
    subStr: function (string) {
      return string.substring(0, 20) + "...";
    },
    firstWord: function (string) {
      return string.split(" ")[0];
    },
  },
};

const collChartData = {
  type: "doughnut",
  data: {
    datasets: [
      {
        // one line graph
      },
    ],
  },
  options: {},
};
