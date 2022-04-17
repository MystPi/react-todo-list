import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  theme,
  Heading,
  Button,
  Input,
  HStack,
  VStack,
  StackDivider,
  Spacer,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FiPlus, FiTrash, FiCheck } from 'react-icons/fi'
import { ColorModeSwitcher } from './ColorModeSwitcher';


function Header() {
  return (
    <HStack alignItems="center">
      <div>
        <Heading>Todo List</Heading>
        <Text>Enter some of your todo's here!</Text>
      </div>
      <Spacer />
      <ColorModeSwitcher />
    </HStack>
  );
}


function InputBox(props) {
  return (
    <HStack my={4}>
      <Input onChange={props.onChange} onKeyDown={props.onKeyDown} value={props.value} placeholder="Enter some text..." />
      <Button rightIcon={<FiPlus />} flex="none" onClick={props.onClick} colorScheme="teal">Add to list</Button>
      <SaveButton isDisabled={props.items === props.storage} onClick={props.saveItems} />
    </HStack>
  );
}


function List(props) {
  const items = props.items.map(
    i => (
      <HStack key={i.value}>
        <Text as={i.done ? 's' : ''}>{i.value}</Text>
        <Spacer />
        <IconButton icon={<FiCheck />} size="xs" onClick={() => props.done(i.value)} />
        <IconButton icon={<FiTrash />} size="xs" onClick={() => props.delItem(i.value)} />
      </HStack>
    )
  );

  return (
    <VStack divider={<StackDivider />} align="stretch">
      {items}
    </VStack>
  );
}


function SaveButton(props) {
  const toast = useToast();

  function handleClick() {
    props.onClick();
    toast({
      title: 'Saved',
      status: 'success',
      isClosable: true,
      position: 'bottom-right'
    });
  }

  return (
    <Button
      isDisabled={props.isDisabled}
      flex="none"
      onClick={handleClick}>
      Save
    </Button>
  );
}


class App extends React.Component {
  constructor(props) {
    super(props);
    let items = [];
    const gotten = localStorage.getItem('items');

    if (gotten) {
      items = JSON.parse(gotten);
    }

    this.state = {
      items: items,
      storage: items,
      input: ''
    };
  }

  componentDidMount() {
    this.saveInterval = setInterval(() => {
      if (this.state.items) {
        this.saveItems();
      }
    }, 20 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.saveInterval);
  }

  saveItems = () => {
    localStorage.setItem('items', JSON.stringify(this.state.items));
    this.setState({
      storage: this.state.items
    });
  }

  onChange = e => {
    this.setState({
      input: e.target.value
    });
  }

  onClick = () => {
    if (this.state.items.find(i => i.value === this.state.input) || !this.state.input) return;

    this.setState({
      items: [...this.state.items, { done: false, value: this.state.input }],
      input: ''
    });
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.onClick();
    }
  }

  delItem = value => {
    this.setState({
      items: this.state.items.filter(i => i.value !== value)
    });
  }

  done = value => {
    const index = this.state.items.findIndex(i => i.value === value);
    const copy = [...this.state.items];

    copy[index].done = true;

    this.setState({
      items: copy
    });
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
        <Box maxW="2xl" mx="auto" px={8} py={16}>
          <Header />

          <InputBox
            onChange={this.onChange}
            onClick={this.onClick}
            onKeyDown={this.onKeyDown}
            saveItems={this.saveItems}
            value={this.state.input}
            items={this.state.items}
            storage={this.state.storage} />

          <List items={this.state.items} delItem={this.delItem} done={this.done} />
        </Box>
      </ChakraProvider>
    );
  }
}


export default App;
