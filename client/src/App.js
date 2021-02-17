import { useEffect } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAvailableExercises, selectCurrentExercise, selectCurrentProgramName, selectProgramNames } from './redux/app/app.selectors';

// PAGES
import PageNotFound from './pages/PageNotFound/PageNotFound.component';
import ServerStatusPage from './pages/ServerStatusPage/ServerStatus.component';

// PROGRAMS TASK 1
import DateDifference from './pages/DateDifference/DateDifference.component';
import SetTheory from './pages/SetTheory/SetTheory.component';
import MatrixOperation from './pages/MatrixOperation/MatrixOperation.component';
import NumberToWordRupee from './pages/NumberToWordRupee/NumberToWordRupee.component';
import RSA from './pages/RSA/RSA.component';
import MD5 from './pages/MD5/MD5.component';
import BarCode128 from './pages/BarCode128/BarCode128.component';
import QRCode from './pages/QRCode/QRCode.component';
import OTP from './pages/OTP/OTP.component';
import Captcha from './pages/Captcha/Captcha.component';

// PROGRAMS TASK 2
import ElectricalCalculator from './pages/ElectricalCalculator/ElectricalCalculator.component';
import MathLog1Calculator from './pages/MathLog1Calculator/MathLog1Calculator.component';
import MathLog2Calculator from './pages/MathLog2Calculator/MathLog2Calculator.component';
import MathLog3Calculator from './pages/MathLog3Calculator/MathLog3Calculator.component';
import StatisticsCalculator from './pages/StatisticsCalculator/StatisticsCalculator.component';

// PROGRAMS TASK 3
import RLECompression from './pages/RLECompression/RLECompression.component';

// COMMON PAGE DISPLAY
import LanguageSelection from './components/LanguageSelection/LanguageSelection.component';
import ProgramSelection from './components/ProgramSelection/ProgramSelection.component';
import ExerciseSelection from './components/ExerciseSelection/ExerciseSelection.component';

import './App.scss';

function App({ CURRENT_PROGRAM_NAME, PROGRAMS_AVAILABLE, CURRENT_EXERCISE, EXERCISE_AVAILABLE, history }) {
  useEffect(() => {
    history.push(`/${CURRENT_EXERCISE}/${CURRENT_PROGRAM_NAME}`)
  }, [CURRENT_PROGRAM_NAME, CURRENT_EXERCISE])
  console.log(PROGRAMS_AVAILABLE.indexOf(CURRENT_PROGRAM_NAME) === 0)
  return (
    <div className="App-wrapper">
      {/* DISPLAY LANGUAGE SELECTION AND PROGRAM SELECTION FOR ALL PAGES */}
      <div className="flex-wrapper">
        <LanguageSelection />
        <ExerciseSelection />
      </div>
      <ProgramSelection />
      <Switch>
        <Route exact path='/'
          render={
            () => CURRENT_PROGRAM_NAME
              ? <Redirect to={`/${EXERCISE_AVAILABLE[0]}/${CURRENT_PROGRAM_NAME}`} />
              : <div className="error-message">Select Any One Program</div>
          } />
        {/* PROGRAM SET 1 */}
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[0]}`} component={DateDifference} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[1]}`} component={SetTheory} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[2]}`} component={MatrixOperation} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[3]}`} component={NumberToWordRupee} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[4]}`} component={RSA} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[5]}`} component={MD5} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[6]}`} component={BarCode128} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[7]}`} component={QRCode} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[8]}`} component={OTP} />
        <Route exact path={`/${EXERCISE_AVAILABLE[0]}/${PROGRAMS_AVAILABLE[9]}`} component={Captcha} />

        {/* PROGRAM SET 2 */}
        <Route exact path={`/${EXERCISE_AVAILABLE[1]}/${PROGRAMS_AVAILABLE[0]}`} component={ElectricalCalculator} />
        <Route exact path={`/${EXERCISE_AVAILABLE[1]}/${PROGRAMS_AVAILABLE[1]}`} component={MathLog1Calculator} />
        <Route exact path={`/${EXERCISE_AVAILABLE[1]}/${PROGRAMS_AVAILABLE[2]}`} component={MathLog2Calculator} />
        <Route exact path={`/${EXERCISE_AVAILABLE[1]}/${PROGRAMS_AVAILABLE[3]}`} component={MathLog3Calculator} />
        <Route exact path={`/${EXERCISE_AVAILABLE[1]}/${PROGRAMS_AVAILABLE[4]}`} component={StatisticsCalculator} />
        
        {/* PROGRAM SET 3 */}
        <Route exact path={`/${EXERCISE_AVAILABLE[2]}/${PROGRAMS_AVAILABLE[0]}`} component={RLECompression} />

        <Route exact path='/status' component={ServerStatusPage} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  CURRENT_PROGRAM_NAME: selectCurrentProgramName,
  PROGRAMS_AVAILABLE: selectProgramNames,
  CURRENT_EXERCISE: selectCurrentExercise,
  EXERCISE_AVAILABLE: selectAvailableExercises
})

export default withRouter(connect(mapStateToProps)(App));
