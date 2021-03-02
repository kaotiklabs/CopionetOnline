const DefaultView = {
  template: `
  
  <div class="container">

  <div id="filedrag"><i class="material-icons" style="font-size: 64px">cloud_upload</i><br>Drop files here</div>

  <div class="row">
        
    <h5>Document Analytics</h5>  

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">State</th>
          <th scope="col">Document</th>
          <th scope="col">Percent</th>
          <th scope="col">Total</th>
          <th scope="col">Unique</th>
          <th scope="col">Template</th>
          <th scope="col">Collisions</th>          
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in this.$store.state.documents">
          <td><b>{{index}}</b></td>
          <td><i class="material-icons" style="font-size: 32px; color: #555555;">{{ getStateIcon(item) }}</i></td>
          <td scope="row">
            <div class="progress" style="height: 30px;">
              <div class="progress-bar" role="progressbar"
                v-bind:style="{width: plagPercent(item) + '%', background: getColor(item)}"
                aria-valuenow="plagPercent(item)" aria-valuemin="0" aria-valuemax="100">
                <span><b>{{ item.file.name | subStr }}</b></span>
              </div>
            </div>
          </td>
          <td>{{ plagPercent(item) }} %</td>
          <td>{{ numTotalChunks(item) }}</td>
          <td>{{ numUniqueChunks(item) }}</td>
          <td>{{ numTemplateChunks(item) }}</td>
          <td>{{ numColChunks(item) }}</td>          
          <td>
            <router-link :to="'/details/'+index"><button type="button" class="btn btn-primary"><i
                  class="far fa-eye"></i> Details</button></router-link>
                  
            <router-link :to="'/edit/'+index"><button type="button" class="btn btn-success"><i
                  class="fas fa-edit"></i></button></router-link>
            <router-link :to="'/remove/'+index"><button type="button" class="btn btn-danger"><i
                  class="far fa-trash-alt"></i></button></router-link>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
  </div>
  `,
  mounted() {},

  methods: {
    numUniqueChunks(item) {
      return Object.keys(item.uniqueDict).length;
    },
    numTemplateChunks(item) {
      return Object.keys(item.templateDict).length;
    },
    numColChunks(item) {
      return Object.keys(item.collisionDict).length;
    },
    numTotalChunks(item) {
      return (
        this.numUniqueChunks(item) +
        this.numTemplateChunks(item) +
        this.numColChunks(item)
      );
    },
    plagPercent(item) {
      var plagPercent = parseInt(
        (this.numColChunks(item) * 100) /
          (this.numTotalChunks(item) - this.numTemplateChunks(item))
      );
      plagPercent = plagPercent || 0;
      return plagPercent;
    },
    getColor(item) {
      var percent = this.plagPercent(item);

      if (percent < 50) {
        return "#147FFB";
      } else if (percent < 80) {
        return "#FECD51";
      } else if (percent >= 80) {
        return "#DA3748";
      }
      return "";
    },
    getStateIcon(item) {
      var state = item.state;

      if (state == 0) {
        return "cloud_queue";
      } else if (state == 1) {
        return "cloud_upload";
      } else if (state == 2) {
        return "build";
      } else if (state == 3) {
        return "content_cut";
      } else if (state == 4) {
        return "line_style";
      } else if (state == 5) {
        return "file_copy";
      } else if (state == 6) {
        return "pattern";
      } else if (state == 7) {
        return "cloud_done";
      } else if (state == 8) {
        return "error";
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
  },
};
