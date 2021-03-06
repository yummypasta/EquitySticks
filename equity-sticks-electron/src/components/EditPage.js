import React from "react";
import { Button, Header, Container, Form, Input, List, Popup, Dropdown, Message, Icon } from "semantic-ui-react";
import Navbar from "./Navbar";
import Routes from "./routes";
import UploadInstructions from "./UploadInstructions";
import DataProvider from "./DataProvider";
import {rsuiColors, properCapitalize} from "./const";

class EditPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			studentsData: [],
			studentsLoaded: false,
			loading: false,
			newNameText: ""
		};
	}

	render() {
		return (
			<div>
				<Navbar activeItem={Routes.edit} />
				<DataProvider.Consumer>
					{
						dataCtx => {
							const {currentClass, classes, editClass, deleteClass } = dataCtx;
							if(currentClass == null || !(currentClass in classes)){
								window.location.href = "#" + Routes.classes;
								return;
							}
							
							const classData = classes[currentClass];
							if(!this.state.studentsLoaded){
								this.setState({studentsData: classData.students, studentsLoaded: true});
								return;
							} 
							return (
								<Container>
									<Header className="mt-md" as="h1">Edit Class</Header>

									<Header
										as="h2"
										content={classData.displayName}
										subheader={classData.students.length + " student" + (classData.students.length == 1 ? "" : "s")}
									/>

									<UploadInstructions classDisplayName={classData.displayName} color={classData.color} onUploadFinished={() => {
										this.setState({studentsLoaded: false});
									}} />
									<Popup on="click" wide="very" trigger={
										<Button labelPosition="left" icon="pencil" content="Edit Name" onClick={() => {
											this.setState({newNameText: classData.displayName});
										}} />
									}>
										<Input value={this.state.newNameText} labelPosition="right" label={
											<Button positive icon="save" onClick={() => {
												const newData = Object.assign(classData);
												newData.displayName = this.state.newNameText;
												editClass(currentClass, newData, () => {
													
												});
											}} />
										} onChange={(e, d) => {
											this.setState({newNameText: d.value});
										}} />
									</Popup>
									<Dropdown
										text={properCapitalize(classData.color)}
										icon="tint"
										floating
										labeled
										button
										className="icon"
										color={classData.color}
									>
										<Dropdown.Menu>
											<Dropdown.Header icon='tint' content='Change color' />
											<Dropdown.Divider />
											{
												rsuiColors.map((color, i) => {
													return (
														<Dropdown.Item
															key={"dropdown-color-selection-" + color}
															label={{ color: color, empty: true, circular: true }}
															text={properCapitalize(color)}
															onClick={() => {
																const newData = Object.assign(classData);
																newData.color = color;
																editClass(currentClass, newData);
															}}
														/>
													);
												})
											}
										</Dropdown.Menu>
									</Dropdown>
									<Popup on="click" wide="very" trigger={
										<Button labelPosition="left" icon="trash alternate" negative content="Delete Class" />
									} style={{textAlign: "center"}}>
										<div>
											<p><b>Are you sure?</b></p>
											<Button labelPosition="left" negative icon="check" content="Permanently Delete" onClick={() => {
												deleteClass(currentClass);
											}} />
										</div>
									</Popup>
									<Header as="h2" className="mt-lg">Students</Header>
									{
										this.state.studentsData.length === 0 ? (
											<Message
												icon="lightbulb"
												header="No students in class"
												info
												content={
													<span>Add your first student by clicking <b><Icon name="plus" /> Add Student</b>, or import from Didax by clicking <b><Icon name="upload" /> Import Data</b></span>
												}
											/>
										) : null
									}
									<List as="ol">
										
										{
											this.state.studentsData.map((student, i) => {
												return (
													<List.Item as="li" key={"student-" + i}>
														<Form>
															<Form.Group widths="equal">
																<Form.Input
																	fluid
																	value={student.firstName}
																	onChange={(e, d) => {
																		const newData = this.state.studentsData;
																		newData[i].firstName = d.value;
																		this.setState({studentsData: newData});
																	}}
																/>
																<Form.Input
																	fluid
																	id="form-subcomponent-shorthand-input-last-name"
																	value={student.lastName}
																	onChange={(e, d) => {
																		const newData = this.state.studentsData;
																		newData[i].lastName = d.value;
																		this.setState({studentsData: newData});
																	}}
																/>
																<Form.Button icon="minus" color="red" inverted circular onClick={() => {
																	const newData = this.state.studentsData;
																	newData.splice(i, 1);
																	this.setState({studentsData: newData});
																}} />
															</Form.Group>
														</Form>
													</List.Item>
												);
											})
										}
										
									</List>

									<div className="mt-lg">
										<Button icon="add" content="Add Student" color={classData.color} labelPosition="left" onClick={() => {
											const newData = this.state.studentsData;
											newData.push({
												firstName: "",
												lastName: "",
												tallies: 0
											});
											this.setState({studentsData: newData});
										}} />
										<Button icon="save" content="Save Changes" positive labelPosition="left" loading={this.state.loading} disabled={this.state.loading} onClick={() => {
											this.setState({loading: true});
											const newData = Object.assign(classData);
											newData.students = this.state.studentsData;
											editClass(currentClass, newData, () => {
												this.setState({loading: false});
											});
										}} />
									</div>

								</Container>
							);
						}
					}
				</DataProvider.Consumer>
			</div>
		);
	}
}

EditPage.propTypes = {
};

export default EditPage;