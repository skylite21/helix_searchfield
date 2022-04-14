import React, { Component, createRef } from 'react';
import './searchfield.css';
import scrollIntoView from 'scroll-into-view-if-needed';

class SearchFieldClass extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { number: 0 };
  // ha nem arrow function-t hasznalnank:
  // this.handleOutsideClick = this.handleOutsideClick.bind(this)
  // this.handleKeyEvents = this.handleKeyEvents.bind(this)
  // }

  state = {
    opened: false,
    searchTerm: '',
    searchResults: this.props.options,
    selectedItem: '',
    cursorIndex: -1
  };
  container = createRef();

  handleOutsideClick = (event) => {
    if (!this.container.current?.contains(event.target)) {
      this.setState({ opened: false, cursorIndex: -1 });
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleInput(input) {
    this.setState({ searchTerm: input, selectedItem: input, opened: false });
  }

  findFirst(term) {
    if (term.length < 1) return '';
    const result = this.props.options.find((option) => option.startsWith(term.toLowerCase()));
    return result || '';
  }

  handleKeyEvents = (e) => {
    if (e.key === 'Enter') {
      const hovered = document.querySelector('.search-field .hover');
      if (hovered) {
        this.handleInput(hovered.textContent);
        return;
      }
      const result = this.findFirst(e.target.value);
      if (result) {
        this.handleInput(result);
      }
    }
    if (e.key == 'ArrowDown') {
      this.setState(({ cursorIndex }) => {
        return {
          opened: true,
          cursorIndex: cursorIndex < this.state.searchResults.length - 1 ? cursorIndex + 1 : cursorIndex
        };
      });
    }
    if (e.key == 'ArrowUp') {
      this.setState(({ cursorIndex }) => {
        return {
          opened: true,
          cursorIndex: cursorIndex > 0 ? cursorIndex - 1 : cursorIndex
        };
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.opened !== this.state.opened) {
      const selected = this.state.searchResults.find((term) => term === this.state.searchTerm);
      if (selected) {
        this.setState({ selectedItem: selected });
      } else {
        this.setState({ selectedItem: '', searchTerm: '' });
      }
    }

    if (prevState.selectedItem !== this.state.selectedItem) {
      this.props.onChange(this.state.selectedItem);
    }

    if (prevState.cursorIndex !== this.state.cursorIndex) {
      if (this.state.cursorIndex === -1) return;
      // console.log('cursorindex> ' + cursorIndex);
      // document.getElementById(cursorIndex)?.scrollIntoViewIfNeeded();
      const el = document.querySelector(`.search-field [data-id="${this.state.cursorIndex}"]`);
      if (el) {
        scrollIntoView(el, {
          scrollMode: 'if-needed',
          block: 'end'
        });
      }
    }

    if (prevState.searchTerm !== this.state.searchTerm) {
      if (this.state.opened) {
        const results = this.props.options.filter((option) => option.includes(this.state.searchTerm.toLowerCase()));
        this.setState({ searchResults: results });
      }
    }
  }
  render() {
    const { opened, searchTerm, searchResults, cursorIndex } = this.state;
    return (
      <div className={opened ? 'search-field' : 'search-field rounded'} ref={this.container}>
        <span className='search-icon' />
        <input className='input-mask' value={this.findFirst(searchTerm)} disabled />
        <input
          className='input-real'
          placeholder={this.props.placeholder}
          value={searchTerm}
          onChange={(event) => {
            this.setState({ searchTerm: event.target.value, cursorIndex: -1, opened: true });
          }}
          onClick={() => {
            this.setState(({ opened }) => ({ opened: !opened }));
          }}
          onKeyDown={this.handleKeyEvents}
        />
        {opened && (
          <div className='options'>
            {searchResults.map((option, index) => (
              <button
                key={option}
                className={`option ${index === cursorIndex ? 'hover' : ''}`}
                onClick={() => {
                  this.handleInput(option);
                }}>
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SearchFieldClass;
