import React from 'react'
import $ from 'jquery'
import assign from 'object-assign'

import NavBar from './NavBar.react'
import Footer from './Footer.react'
import { SimpleSelect } from 'react-selectize'
import loader from '../assets/gears.svg'

import routerUtils from '../../lib/routerUtils'
import AwardActions from '../actions/AwardActions'
import AwardStore from '../stores/AwardStore'


import './category.styl'

export default class Categories extends React.Component {
  constructor(props) {
    super(props)

    this.state = {selectedData: {}, submitData: false, error: null}

    this.goBack = this.goBack.bind(this)
    this.submitVote = this.submitVote.bind(this)
    this.valueChange = this.valueChange.bind(this)
  }
  goBack() {
    this.setState({submitData: false})
  }
  valueChange(id, data) {
    this.setState({error: null})

    if (!$.isEmptyObject(data))
      this.setState({selectedData: assign({}, this.state.selectedData, {[id]: data.value})})
    else
      delete this.state.selectedData[id]
  }
  submitVote() {
    if (!$.isEmptyObject(this.state.selectedData)) {
      AwardActions.submitData(this.state.selectedData)
      this.setState({submitData: true})
    } else{
      this.setState({error: 'Please cast at least a vote.'})
    }
  }
  loading() {
    return (<img className='loader' src={loader} />)
  }

  render() {
    var categories
    if (!$.isEmptyObject(this.props.data)) {
      categories = this.props.data.categories.map(category =>
        {
          return (
            <Category
              category_id={category.id}
              title={category.title}
              key={category.id}
              users={this.props.data.users}
              desc={category.short_description}
              image_url={category.imageUrl}
              index={category.id}
              valueChange={this.valueChange}
            />
          )
        }
      )
    }

    return (
      <div className='main'>
        {
          this.state.submitData ? <SuccessPage goBack={this.goBack} /> :
          (
            <div className='main-holder'>
              {
                $.isEmptyObject(this.props.data) ? this.loading() :
                (
                  <div className='holder'>
                    <div className='container'>
                      {categories}
                    </div>
                    <p className='error-msg'>{this.state.error}</p>
                    <button onClick={this.submitVote}>Submit</button>
                  </div>
                )
              }

            </div>
          )
        }
      </div>
    )
  }
}


class Category extends React.Component {
  constructor(props) {
    super(props)
  }
  valueChange(value) {
    this.props.valueChange(this.props.category_id, value)
  }
  render() {
    var options = this.props.users.map(user => <option key={user.email} value={user.email}>{user.name}</option>)

    return(
      <div className={`category${this.props.index} category`}>
        <Style image_url={this.props.image_url} index={this.props.index} className='category' />
        <div className='overlay'></div>
        <div className='details'>
          <div>
            <h1>{this.props.title}</h1>
            <p><i>{this.props.desc}</i></p>
          </div>
          <SimpleSelect placeholder = 'Example: Kay Ade' className='simple-container' onValueChange = {this.valueChange.bind(this)}>
            {options}
          </SimpleSelect>
        </div>
      </div>
    )
  }
}

const Style = props => {
  var dangerousStyleTag = () => {
    if (props.image_url) {
      var index = ''
      if (props.index)
        index = props.index
      return {__html: `
        .${props.className}${index} {
          background: url(${props.image_url});
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        `
      }
    } else {
      return null
    }
  }
  return <style dangerouslySetInnerHTML={dangerousStyleTag()} />
}

const SuccessPage = props => {
  return (
    <div className='success'>
      <h1>Thanks for voting</h1>
      <center>Your entries have been submitted.</center>
      <center>You can click <a className='back' onClick={props.goBack}>back</a> to modify your votes.</center>
    </div>
  )
}
