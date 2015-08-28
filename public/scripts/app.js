var AssociationBox = React.createClass({
  getInitialState: function() {
    return {selectedPlantName: null};
  },
  displayAssociatedPlant: function(plantName) {
    this.setState({selectedPlantName: plantName});
  },
  render: function() {
    var associatedPlants;
    if (this.state.selectedPlantName) {
      var plant = this.props.data.find({name: this.state.selectedPlantName});
      associatedPlants = <AssociatedPlants good={plant.good} bad={plant.bad} onSelectedPlant={this.displayAssociatedPlant} />
    }
    return (
      <div className='associationBox'>
        <SearchBar plantsNames={this.props.data.map('name')} onSelectedPlant={this.displayAssociatedPlant} />
        <h1>{this.state.selectedPlantName}</h1>
        {associatedPlants}
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
        <h3>Bonne</h3>
        {this.displayPlantList(this.props.good)}
        <h3>Mauvaise</h3>
        {this.displayPlantList(this.props.bad)}
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
      <div className='plant' onClick={this.selectPlant}>
        {this.props.name}
      </div>
    );
  }
});

React.render(
  <AssociationBox data={window.plants} />,
  document.getElementById('content')
);

