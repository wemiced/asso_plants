var AssociationBox = React.createClass({
  getInitialState: function() {
    return {selectedPlantName: null};
  },
  displayAssociatedPlant: function(plantName) {
    this.setState({selectedPlantName: plantName});
  },
  render: function() {
    var associatedPlants;
    var descriptionAssociatedPlants;
    if (this.state.selectedPlantName) {
      var plant = this.props.data.find({name: this.state.selectedPlantName});
      associatedPlants = <AssociatedPlants good={plant.good} bad={plant.bad} onSelectedPlant={this.displayAssociatedPlant} />
      // TON CODE POUR LES DESCRIPTIONS DES PLANTES, IL EST LA
      descriptionAssociatedPlants = <section className="bg-grey associated-box">
                                      <div className="container">
                                        <div className="three columns">
                                          <div className="circle big-circle bg-grey-20"></div>
                                        </div>
                                        <div className="nine columns">
                                          <h1 className="float-left">{this.state.selectedPlantName}</h1>
                                          <i className="icon icon-cross float-right">X</i>
                                          <hr className="clearfix"/>
                                          <p> La tomate est un légume, euh en fait cest un fruit qui prends sa source au mont gerbier de jonc, elle se mange debout avec des bretelles. Cest super bon pour la santé, et ça fait péter.</p>
                                        </div>
                                      </div>
                                    </section>
    }
    return (
      <div className='associationBox'>
        <header>
          <div className="container">
            <h1 className="text-center"> Make plant not war</h1>
            <h4 className="text-center">Tableau relationnel des associations de plantes pour potager</h4>
          </div>
        </header> 
        <div className="container form">
          <SearchBar plantsNames={this.props.data.map('name')} onSelectedPlant={this.displayAssociatedPlant} />
        </div>
        {descriptionAssociatedPlants}
        <section className="double-top">
          {associatedPlants}
        </section>
        <footer>
            <h4 className="text-center text-dark-dark">Made with love</h4>
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
      source: substringMatcher(this.props.plantsNames)
    })
    .on('typeahead:select', function(event, plantName) {
      that.props.onSelectedPlant(plantName);
      $('#typeahead').typeahead('val', '');
    });
  },
  render: function() {
    return (
      <div className='SearchBar'>
        <input type="text" name='vegetables' id='typeahead' placeholder="Rechercher une plante" ref="plantName" />
        <input type="submit" value="Rechercher" />
      </div>
    );
  }
});

var AssociatedPlants = React.createClass({
  displayPlantList: function(plants) {
    var that = this;
    return plants.map(function(plantName) {
      return <Plant name={plantName} onSelectedPlant={that.props.onSelectedPlant} />;
    });
  },
  render: function() {
    return(
      <div className='associatedPlants'>
        <div className="container">
          <div className="six columns">
            <h3>Bonne</h3>
            <hr/>
            {this.displayPlantList(this.props.good)}
          </div>
          <div className="six columns">
            <h3>Mauvaise</h3>
            <hr/>
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
      <div className='plant-box six columns bg-grey' onClick={this.selectPlant}>
        <div>
          <div className="circle small-circle bg-grey-20"></div>
          {this.props.name}
        </div>
      </div>
    );
  }
});

React.render(
  <AssociationBox data={window.plants} />,
  document.getElementById('content')
);
