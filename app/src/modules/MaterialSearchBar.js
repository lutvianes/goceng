import React, {Component} from 'react'
import scriptLoader from 'react-async-script-loader'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import config from '../../config/credentials/secrets'

const AutocompleteItem = ({ formattedSuggestion }) => {
  return (
    <div className="suggestion-item">
      <i className='fa fa-map-marker suggestion-icon'/>
      <strong>{formattedSuggestion.mainText}</strong>{' '}
      <small className="text-muted">{formattedSuggestion.secondaryText}</small>
    </div>
  )
}

class MaterialSearchBar extends Component {  
  state = { address: "" }
  
  onChange = (address) => {
    this.setState({ address })
    geocodeByAddress(address, (err, { lat, lng }, results) => {
      if (err) { 
        console.error('Error'); return; 
      } else {
        this.props.onChange(address, [lat, lng])  
      }
    })
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        this.initAutoComplete()
      } else this.props.onError()
    }
  }
 
  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initAutoComplete()
    }
  }

  initAutoComplete() {
    
  }
  
  render() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      const options = {
        location: new google.maps.LatLng(-6.893248, 107.610659),
        radius: 1000
      }
      const cssClasses = {
        root: 'form-group',
        label: 'form-label',
        input: 'search-input',
        autocompleteContainer: 'autocomplete-container'
      }
            
      return (
        <PlacesAutocomplete
          value={this.state.address}
          classNames={cssClasses}
          autocompleteItem={AutocompleteItem}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          onEnterKeyDown={this.onEnterKeyDown} 
          options={options}
        />
      )
    } else {
      return (
        <div/>
      )
    }
  }
}

export default scriptLoader(
  ['https://maps.googleapis.com/maps/api/js?key=' + config.GOOGLE_MAPS_API_KEY + '&libraries=places']
)(MaterialSearchBar)