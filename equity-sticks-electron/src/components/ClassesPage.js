import React from "react";
import { Header, Button, Container, Popup, Segment, Message, Icon } from "semantic-ui-react";
import Navbar from "./Navbar";
import Routes from "./routes";
import DataProvider from "./DataProvider";
import {getRandomItem, rsuiColors, DOWNLOAD_URL} from "./const";
import {checkForUpdates} from "./updateChecker";

const shell = window.require("electron").shell;

class ClassesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showUpdateMessage: false
		};
		checkForUpdates().then(updateStatus => {
			this.setState({showUpdateMessage: updateStatus});
		})
	}

	render() {
		return (
			<div>
				<Navbar activeItem={Routes.classes} />
				<DataProvider.Consumer>
					{
						dataCtx => {
							const {currentClass, classes, preferences, changeClass, editClass, editPrefs } = dataCtx;

							return (
								<Container>
									<Header className="title mt-md" as="h1">My Classes</Header>
									{
										this.state.showUpdateMessage ? (
										<Message
										style={{cursor: "pointer"}}
											icon="lightbulb"
											header="An update is available"
											info
											content={
												<span>A new version is available! Click here to download the latest version.</span>
											}
											onClick={(e) => {
												e.preventDefault();
												shell.openExternal(DOWNLOAD_URL);
											}}
										/>
										) : null
									}
									{
										Object.keys(classes).map(classId => {
											const classData = classes[classId];
											return (
												<Button key={"classbtn-" + classId} fluid color={classData.color} inverted={currentClass !== classId} style={{marginBottom: "10px"}} onClick={() => {
													changeClass(classId, () => {
														window.location.href = "#" + Routes.tally;
													});
												}}>
													<Header
														inverted={currentClass === classId}
														as="h3"
														content={classData.displayName}
														subheader={classData.students.length + " student" + (classData.students.length == 1 ? "" : "s")}
													/>
												</Button>
											);
										})
									}
									<Segment basic textAlign="center">
										<Popup inverted position="top center" trigger={
											<Button icon="plus" circular positive size="huge" onClick={() => {
												const randomId = preferences.idIncrementor.toString() + Math.random().toString(36).substring(2, 15);
												editClass(randomId, {
													displayName: "My New Class " + preferences.idIncrementor,
													color: getRandomItem(rsuiColors),
													students: [],
													history: []
												});
												editPrefs("idIncrementor", preferences.idIncrementor + 1);
											}} />
										}>
											New class
										</Popup>
									</Segment>
									{
										Object.keys(classes).length == 0 ?
											(
												<Message
													icon="lightbulb"
													header="You have no classes"
													info
													content={
														<span>Add a class with the <Icon name="plus" /> button to get started!</span>
													}
												/>
											) : null
									}
								</Container>
							);
						}
					}
				</DataProvider.Consumer>
			</div>
		);
	}
}

ClassesPage.propTypes = {};

export default ClassesPage;