
var AssociationBox = React.createClass({
  componentDidMount: function() {
      window.addEventListener('scroll', this.handleScroll);
      this.scrollTop = 0;
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll: function(event) {
    this.scrollTop = event.srcElement.body.scrollTop;
    if (this.scrollTop >= 150)
    {
      $('header').removeClass('open');
      $('.associated-box').removeClass('open');
      $('.SearchBar').removeClass('open');
    }
  },
  getInitialState: function() {
    return {
      oldSelectedPlantName: '',
      selectedPlantName: 'Tomate'
    };
  },
  displayAssociatedPlant: function(plantName) {
    this.setState({
      oldSelectedPlantName: this.props.data.find({name: this.state.selectedPlantName}),
      selectedPlantName: plantName
    });
  },
  render: function() {
    var associatedPlants;
    var descriptionAssociatedPlants;
    if (this.state.selectedPlantName) {
      var plant = this.props.data.find({name: this.state.selectedPlantName});
      var data = this.props.data;
      associatedPlants = <AssociatedPlants ground={plant.ground} oldPlant={this.state.oldSelectedPlantName} plant={plant} good={plant.good} bad={plant.bad} data={this.props.data} onSelectedPlant={this.displayAssociatedPlant} />
      descriptionAssociatedPlants = <div className="fly-in">
                                      <section className="bg-grey open associated-box">
                                        <div className="container">
                                          <div className="three columns">
                                            <div className="circle big-circle">
                                              <img src={plant.img} />
                                            </div>
                                          </div>
                                          <div className="nine columns">
                                            <h1 className="float-left fly-in b i">{this.state.selectedPlantName}</h1>
                                            <hr className="clearfix"/>
                                            <p className="justify"> {plant.desc} </p>
                                            {plant.ground}
                                          </div>
                                        </div>
                                      </section>
                                      <div className="triangle-illu"></div>
                                    </div>
    }
    return (
      <div className='associationBox'>
        <div className="header-box">
          <header className="open">
            <h1 className="text-center text-white quad-top b i">Make love not war</h1>
            <h4 className="text-center text-light-dark">Un tableau associatif des plantes de jardin</h4>
            <div className="container form">
              <SearchBar plantsNames={this.props.data.map('name')} data={this.props.data} onSelectedPlant={this.displayAssociatedPlant} />
            </div>
          </header>
        </div>
        {descriptionAssociatedPlants}
        <section className="double-top">
          {associatedPlants}
        </section>
        <div className="footer-illu double-top"></div>
        <footer>
            <h4 className="text-center text-dark-dark b i">Made with love</h4>
        </footer>
      </div>
    );
  }
});

var SearchBar = React.createClass({
  componentDidMount: function() {
    var that = this;
    $('#typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'vegetables',
      source: substringMatcher(this.props.plantsNames),
      templates: {
        empty: [
          '<div class="empty-message">',
          'Désolé, aucun résultat pour votre recherche :-(',
          '</div>'
        ].join('\n'),
        suggestion: function(data) {
          var vegeSuggestion = that.props.data.find({name: data});
          return  '<div>'
                +   '<span class="b i">' + data + '</span>'
                +   '<div class="float-right">'
                +      '<span>' + vegeSuggestion.bad.length + '</span>'
                +   '  <img src="/assets/svg/ennemies.svg" class="suggestions"/>'
                +   '</div>'
                +   '<div class="float-right">'
                +      '<span>' + vegeSuggestion.good.length + '</span>' 
                +   '  <img src="/assets/svg/friends.svg"  class="suggestions"/>'
                +   '</div>'
                + '</div>';
        }
      }
    })
    .on('typeahead:select', function(event, plantName) {
      that.props.onSelectedPlant(plantName);
      $('#typeahead').typeahead('val', '');
    });
  },
  render: function() {
    return (
      <div className='SearchBar open'>
        <input type="text" name='vegetables' id='typeahead' placeholder="Rechercher une plante" ref="plantName" />
        <div className="search-icon">
          <img src="/assets/svg/search.svg"/>
        </div>
        <input type="submit" value=""/>
      </div>
    );
  }
});

var AssociatedPlants = React.createClass({
  displayPlantList: function(plants) {
    var that = this;
    return plants.map(function(plantName, plantImg) {
      var plantInfo = that.props.data.find({name: plantName});
      return <Plant name={plantName} img={plantInfo.img} nbFriends={plantInfo.good.length} nbEnemies={plantInfo.bad.length} onSelectedPlant={that.props.onSelectedPlant} />;
    });
  },
  render: function() {
    return(
      <div className='associatedPlants'>
        <div className="container">
          <div className="fly-in six columns">
            <div className="quad-bottom friends-icon float-left">
              <img src="/assets/svg/friends.svg"/>
            </div>
            <h3 className="quad-bottom float-left i b">Amis <span className="text-grey-20">({this.displayPlantList(this.props.good).length})</span></h3>
            <div className="clearfix"></div>
            {this.displayPlantList(this.props.good)}
          </div>
          <div className="fly-in six columns">
            <div className="quad-bottom ennemies-icon float-left">
              <img src="/assets/svg/ennemies.svg"/>
            </div>
            <h3 className="quad-bottom float-left i b">Ennemies <span className="text-grey-20">({this.displayPlantList(this.props.bad).length})</span></h3>
            <div className="clearfix"></div>
            {this.displayPlantList(this.props.bad)}
          </div>
        </div>
      </div>
    );
  }
});

var Plant = React.createClass({
  selectPlant: function() {
    this.props.onSelectedPlant(this.props.name);
  },
  render: function() {
    return (
      <div className='plant-box fly-in' onClick={this.selectPlant}>
        <div className="double-top circle super-small-circle bg-white"></div>
        <div className="double-bottom">
          <div className="circle small-circle">
            <img src={this.props.img} />
          </div>
          <h4 className="text-center b i"> {this.props.name} </h4>
        </div>
        <div>
          <div>
            <div className="friends-icon float-left">
              <img src="assets/svg/friends.svg"/>
            </div>
            <p className="float-left">{this.props.nbFriends}</p>
            <p className="float-right">{this.props.nbEnemies}</p>
            <div className="ennemies-icon float-right">
              <img src="assets/svg/ennemies.svg"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

React.render(
  <AssociationBox data={window.plants} />,
  document.getElementById('content')
);
