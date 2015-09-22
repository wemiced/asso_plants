console.log('toto');

var AssociationBox = React.createClass({

  componentDidMount: function() {
      window.addEventListener('scroll', this.handleScroll);
      this.scrollTop = 0;
  },
  componentWillMount: function() {
    $('body,html').bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e){
      if ( e.which > 0 || e.type == "mousedown" || e.type == "mousewheel") {
        $("html,body").stop();
      }
    });
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll: function(event) {
    if ($(window).scrollTop() >= 1)
    {
      event.preventDefault();
      $('header').removeClass('open');
      $('.associated-box').removeClass('open');
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
    var plant;
    if (this.state.selectedPlantName) {
      var plant = this.props.data.find({name: this.state.selectedPlantName});
      var data = this.props.data;
      associatedPlants = <AssociatedPlants ground={plant.ground} oldPlant={this.state.oldSelectedPlantName} plant={plant} good={plant.good} bad={plant.bad} data={this.props.data} onSelectedPlant={this.displayAssociatedPlant} />
    }
    return (
      <div className='associationBox'>
        <div className="header-box quad-bot">
          <header className="open">
            <div className="illu-handler quad-top">
              <img src="/assets/imgs/svgs/main_illu.svg"/>
            </div>
            <h5 className="text-center">Tableau associatif des plantes de jardin</h5>
            <div className="container form">
              <SearchBar plantsNames={this.props.data.map('name')} data={this.props.data} onSelectedPlant={this.displayAssociatedPlant} />
            </div>
          </header>
        </div>
        <PlantDescription plant={plant} />
        <section className="double-top">
          {associatedPlants}
        </section>
        <div className="footer-illu double-top"></div>
        <footer>
          <h6 className="text-center b i">Made with love</h6>
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
                +   '<div class="pull-right">'
                +      '<span>' + vegeSuggestion.bad.length + '</span>'
                +   '<i class="icon icon-ennemies text-grey-40 pull-left"></i>'
                +   '</div>'
                +   '<div class="pull-right">'
                +      '<span>' + vegeSuggestion.good.length + '</span>'
                +   '<i class="icon icon-friends text-grey-40 pull-left"></i>'
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
    var that = this;
    return (
      <div className='SearchBar open'>
        <input type="text" name='vegetables' id='typeahead' placeholder="Rechercher une plante" ref="plantName" />
        <i className="icon icon-search icon-2x text-grey-40" /*onClick={function(){that.props.onSelectedPlant($('#typeahead').val())}}*/></i>
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
          <div className="fly-in six col">
            <i className="icon icon-2x icon-friends text-grey-40 pull-left"></i>
            <h5 className="quad-bot pull-left i b">Amis <span className="text-grey-20">({this.displayPlantList(this.props.good).length})</span></h5>
            <div className="clearfix"></div>
            {this.displayPlantList(this.props.good)}
          </div>
          <div className="fly-in six col">
            <i className="icon icon-2x icon-ennemies text-grey-40 pull-left"></i>
            <h5 className="quad-bot pull-left i b">Ennemies <span className="text-grey-20">({this.displayPlantList(this.props.bad).length})</span></h5>
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
    $('html, body').animate({scrollTop:0}, 400, "easeInOutCubic");
  },
  render: function() {
    return (
      <div className='plant-box fly-in' onClick={this.selectPlant}>
        <div className="add-top circle super-small-circle bg-white"></div>
        <div className="double-bot">
          <div className="circle small-circle">
            <img src={this.props.img} />
          </div>
          <h6 className="text-center b i"> {this.props.name} </h6>
        </div>
        <div>
          <div>
            <i className="icon icon-friends text-grey-40 half-padding pull-left"></i>
            <p className="pull-left">{this.props.nbFriends}</p>
            <p className="pull-right">{this.props.nbEnemies}</p>
            <i className="icon icon-ennemies text-grey-40 half-padding pull-right"></i>
          </div>
        </div>
      </div>
    );
  }
});

var SowingHarverstDate = React.createClass({
  render: function() {
    return <div className='swing-and-harvest-date'>
      <div className='sowing-date'> {this.props.sowing_date} </div>
      <div className='harvest-date'> {this.props.harvest_date} </div>
    </div>
  }
});

var GroundType = React.createClass({
  render: function() {
    return <div className='swing-and-harvest-date'>
      <div className='ground-type'> {this.props.ground_type} </div>
    </div>
  }
});

var PlantDescription = React.createClass({
  render: function() {
    return <div className="fly-in">
      <section className="bg-grey-15 open associated-box">
        <div className="container">
          <div className="three col">
            <div className="circle big-circle">
              <img src={this.props.plant.img} />
            </div>
          </div>
          <div className="nine col">
            <h4 className="pull-left fly-in b i">{this.props.plant.name}</h4>
            <hr className="lines"/>
            <p className="justify"> {this.props.plant.desc} </p>
            <GroundType ground_type={this.props.plant.ground_type}/>
            <SowingHarverstDate sowing_date={this.props.plant.sowing_date} harvest_date={this.props.plant.harvest_date}/>
          </div>
        </div>
      </section>
      <div className="triangle-illu"></div>
    </div>
  }
});

React.render(
  <AssociationBox data={window.plants} />,
  document.getElementById('content')
);
