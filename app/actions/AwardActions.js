import AppDispatcher from '../dispatcher/AppDispatcher'
import AwardConstants from '../constants/AwardConstants'
import ajaxMessenger from '../../lib/ajaxMessenger'

var AwardActions = {
  fetchInitialData(token) {
    ajaxMessenger('GET', 'categories', token)
      .always(data => {
        AppDispatcher.dispatch({
          actionType: AwardConstants.AWARD_FETCH_INITIAL_DATA,
          data: data
        })
      })
  },

  fetchVotes(token) {
    ajaxMessenger('GET', 'votes', token)
      .always(data => {
        AppDispatcher.dispatch({
          actionType: AwardConstants.AWARD_FETCH_VOTES,
          data: data
        })
      })
  },

  submitData(data) {
    ajaxMessenger('POST', 'votes', localStorage.getItem('authToken'), {votes: {selectedCategories: data}})
      .always(response => {
        AppDispatcher.dispatch({
          actionType: AwardConstants.AWARD_SUBMIT_DATA,
          data: response
        })
      })
  }
}

export default AwardActions
