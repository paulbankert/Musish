import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Alert from 'react-s-alert';
import Mousetrap from 'mousetrap';
import MusicKitProvider from './MusicKitProvider';
import MusicKitAuthorizeProvider from './MusicKitAuthorizeProvider';
import AlbumsPage from './Inside/Pages/Library/Albums/AlbumsPage';
import Layout from './Inside/Layout';
import ArtistPage from './Inside/Pages/Catalog/Artist/ArtistPage';
import ArtistsPage from './Inside/Pages/Library/Artists/ArtistsPage';
import Playlist from './Inside/Pages/Library/Playlist/PlaylistPage';
import SongsPage from './Inside/Pages/Library/Songs/SongsPage';
import PlaylistsPage from './Inside/Pages/Library/Playlists/PlaylistsPage';
import RecentlyAddedPage from './Inside/Pages/Library/RecentlyAdded/RecentlyAddedPage';
import ForYouPage from './Inside/Pages/Catalog/ForYou/ForYouPage';
import BrowsePage from './Inside/Pages/Catalog/Browse/BrowsePage';
import GenrePage from './Inside/Pages/Catalog/Browse/Genres/Genre/GenrePage';
import RadioPage from './Inside/Pages/Catalog/Radio/RadioPage';
import QueueContext from './Inside/Player/Queue/QueueContext';
import ModalContext from './Common/Modal/ModalContext';
import Modal from './Common/Modal/Modal';
import ConnectedMenu from './Common/ContextMenu/ContextMenu';
import LyricsModalContext from './Inside/Player/Lyrics/LyricsModalContext';
import LyricsModal from './Inside/Player/Lyrics/LyricsModal';
import SearchPage from './Inside/Pages/Search/SearchPage';
import GoogleAnalyticsProvider from './GoogleAnalyticsProvider';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQueue: false,
      modalsContents: [],
      lyricsModalOpen: false,
    };

    this.popModal = this.popModal.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind('esc', this.popModal, 'keyup');
  }

  popModal() {
    this.setState(state => ({
      modalsContents: state.modalsContents.slice(1),
    }));
  }

  render() {
    const queueState = {
      show: this.state.showQueue,
      doShow: () => this.setState({ showQueue: true }),
      doHide: () => this.setState({ showQueue: false }),
    };

    const modalState = {
      push: c =>
        this.setState(state => ({
          modalsContents: [c, ...state.modalsContents],
        })),
      replace: c =>
        this.setState(state => ({
          modalsContents: [...state.modalsContents.slice(0, -1), c],
        })),
      pop: this.popModal,
      flush: () =>
        this.setState({
          modalsContents: [],
        }),
    };

    const lyricsModalState = {
      opened: this.state.lyricsModalOpen,
      open: () => this.setState({ lyricsModalOpen: true }),
      close: () => this.setState({ lyricsModalOpen: false }),
    };

    return (
      <MusicKitProvider>
        <Router>
          <GoogleAnalyticsProvider>
            <MusicKitAuthorizeProvider>
              <QueueContext.Provider value={queueState}>
                <ModalContext.Provider value={modalState}>
                  <LyricsModalContext.Provider value={lyricsModalState}>
                    <Layout>
                      <Switch>
                        <Route path={'/'} exact component={ForYouPage} />
                        <Route path={'/me/added'} component={RecentlyAddedPage} />
                        <Route path={'/me/albums'} component={AlbumsPage} />
                        <Route path={'/me/playlists'} exact component={PlaylistsPage} />
                        <Route
                          path={'/me/playlists/:id'}
                          exact
                          component={props => <Playlist key={props.location.pathname} {...props} />}
                        />
                        <Route path={'/me/artists'} exact component={ArtistsPage} />
                        <Route path={'/me/artists/:id'} component={ArtistsPage} />
                        <Route path={'/me/songs'} exact component={SongsPage} />
                        <Route path={'/artist/:id'} exact component={ArtistPage} />
                        <Route path={'/browse/genre/:id'} exact component={GenrePage} />
                        <Route path={'/browse'} component={BrowsePage} />
                        <Route path={'/radio'} exact component={RadioPage} />
                        <Route
                          path={'/search/:source/:query'}
                          exact
                          component={({
                            match: {
                              params: { source, query },
                            },
                          }) => <SearchPage key={`${source}${query}`} />}
                        />
                        <Redirect to={'/'} />
                      </Switch>
                      {this.state.modalsContents.length > 0 && (
                        <Modal
                          key={this.state.modalsContents.length}
                          open
                          handleClose={modalState.pop}
                          render={() => this.state.modalsContents[0]}
                        />
                      )}
                    </Layout>
                    <ConnectedMenu />
                    <Alert stack offset={60} />
                    <LyricsModal />
                  </LyricsModalContext.Provider>
                </ModalContext.Provider>
              </QueueContext.Provider>
            </MusicKitAuthorizeProvider>
          </GoogleAnalyticsProvider>
        </Router>
      </MusicKitProvider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
