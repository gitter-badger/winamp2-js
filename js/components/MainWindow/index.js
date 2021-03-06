import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import { WINDOWS } from "../../constants";
import {
  loadFilesFromReferences,
  removeAllTracks,
  toggleMainWindowShadeMode
} from "../../actionCreators";

import DropTarget from "../DropTarget";
import MiniTime from "../MiniTime";

import { SET_FOCUSED_WINDOW } from "../../actionTypes";
import ActionButtons from "./ActionButtons";
import MainBalance from "./MainBalance";
import Close from "./Close";
import ClutterBar from "./ClutterBar";
import MainContextMenu from "./MainContextMenu";
import Eject from "./Eject";
import EqToggleButton from "./EqToggleButton";
import PlaylistToggleButton from "./PlaylistToggleButton";
import Kbps from "./Kbps";
import Khz from "./Khz";
import Marquee from "./Marquee";
import MonoStereo from "./MonoStereo";
import Position from "./Position";
import Repeat from "./Repeat";
import Shade from "./Shade";
import Shuffle from "./Shuffle";
import Time from "./Time";
import Visualizer from "./Visualizer";
import MainVolume from "./MainVolume";

import "../../../css/main-window.css";

export class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._handleDrop = this._handleDrop.bind(this);
  }

  _handleClick() {
    this.props.setFocus();
  }

  _handleDrop(e) {
    this.props.removeAllTracks();
    this.props.loadFilesFromReferences(e);
  }

  render() {
    const {
      focused,
      loading,
      doubled,
      shade,
      llama,
      status,
      working
    } = this.props;

    const className = classnames({
      window: true,
      // TODO: Handle these status changes in the individual components
      play: status === "PLAYING",
      stop: status === "STOPPED",
      pause: status === "PAUSED",
      selected: focused === WINDOWS.MAIN,
      draggable: true,
      loading,
      doubled,
      llama,
      shade
    });

    return (
      <DropTarget
        id="main-window"
        className={className}
        onMouseDown={this._handleClick}
        handleDrop={this._handleDrop}
      >
        <div
          id="title-bar"
          className="selected title-bard draggable"
          onDoubleClick={this.props.toggleMainWindowShadeMode}
        >
          <MainContextMenu fileInput={this.props.fileInput} />
          {shade && <MiniTime />}
          <div id="minimize" />
          <Shade />
          <Close />
        </div>
        <div className="status">
          <ClutterBar />
          {!working && <div id="play-pause" />}
          <div
            id="work-indicator"
            className={classnames({ selected: working })}
          />
          <Time />
          <Visualizer analyser={this.props.mediaPlayer._analyser} />
        </div>
        <div className="media-info">
          <Marquee />
          <Kbps />
          <Khz />
          <MonoStereo />
        </div>
        <MainVolume />
        <MainBalance />
        <div className="windows">
          <EqToggleButton />
          <PlaylistToggleButton />
        </div>
        <Position />
        <ActionButtons />
        <Eject fileInput={this.props.fileInput} />
        <div className="shuffle-repeat">
          <Shuffle />
          <Repeat />
        </div>
        <a
          id="about"
          target="blank"
          href="https://github.com/captbaritone/winamp2-js"
          title="About"
        />
      </DropTarget>
    );
  }
}

const mapStateToProps = state => {
  const {
    media: { status },
    display: { loading, doubled, shade, llama, working },
    windows: { focused }
  } = state;
  return { status, loading, doubled, shade, llama, working, focused };
};

const mapDispatchToProps = {
  setFocus: () => ({ type: SET_FOCUSED_WINDOW, window: WINDOWS.MAIN }),
  loadFilesFromReferences: e => loadFilesFromReferences(e.dataTransfer.files),
  removeAllTracks,
  toggleMainWindowShadeMode
};
export default connect(mapStateToProps, mapDispatchToProps)(MainWindow);
