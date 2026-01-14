<script lang="ts">	import { onMount } from "svelte";
  import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Tooltip, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Spinner } from '@sveltestrap/sveltestrap';
  import { toasts } from "../../lib/stores/toastStore";
  import ToastNotifications from "../common/ToastNotifications.svelte";
  import Logs from "../apps/admin/logs.svelte";
  import { userStore } from "../../lib/stores/userStore";

  let user = $userStore;
  let isLoading = !user;

  let message = "";
  let errors = false;

  // Initialize URLs only when user is available
  $: url = user?.url_base ? user.url_base + "/info" : "";
  $: url2 = user?.url_base ? user.url_base + "/change_password" : "";
  $: url3 = user?.url_base ? user.url_base + "/last_login" : "";

  let open = false;
  let filter: [Boolean, String];
  filter = [true, "codeconvert"];
  const toggle = () => (open = !open);

  let oldPassword = '';
  let newPassword = '';
  let repeatNewPassword = '';

  // Update user when userStore changes
  $: {
    user = $userStore;
    isLoading = !user;
  }
  async function handleSubmit() {
    if (!user) return;
    
    const formData = new FormData();
    formData.append('oldPassword', oldPassword)
    formData.append('newPassword', newPassword)
    formData.append('repeatNewPassword', repeatNewPassword)
    await fetch(url2, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${user.token}`
      }    }).then((response) => {
      if (response.ok) {
        message = "Password sucessfully changed.";
        toasts.push({ message, color: 'success' });
        errors = true;
        return response.json();
      } else {
        message = "Something went wrong. Make sure old password is correct, both new passwords match, and the new password is not the same as the original.";
        toasts.push({ message, color: 'danger' });
        errors = true;
      }
    });
  }

  onMount(() => {
    if (user && url3) {
      fetch(url3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.token,
        },
      });
    }
  });
  
  let profilePicture = '';
  function handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<ToastNotifications position="top-right" maxToasts={5} />

<Container>
  {#if isLoading}
    <Row class="justify-content-center">
      <Col md="8">
        <Card class="mt-4">
          <CardBody class="text-center">
            <Spinner color="primary" />
            <p class="mt-3">Loading user information...</p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  {:else if user}
    <Row class="justify-content-center">
      <Col md="8">
        <Card class="mt-4">
          <CardBody>
            <CardTitle>User Information</CardTitle>
            <CardText class="text-muted">User: {user.name}</CardText>
            <div>
              <CardText class="text-muted" id="access-level">Access Level: {user.allowed_apps}</CardText>
              <Button color="secondary" on:click={toggle}>Change Password</Button>
              <Modal isOpen={open} {toggle}>
                <ModalHeader toggle={toggle}>Change Password</ModalHeader>
                <ModalBody>
                  <Form on:submit={handleSubmit}>
                    <FormGroup>
                      <Label for="oldPassword">Old Password</Label>
                      <Input type="password" id="oldPassword" bind:value={oldPassword} required />
                    </FormGroup>
                    <FormGroup>
                      <Label for="newPassword">New Password</Label>
                      <Input type="password" id="newPassword" bind:value={newPassword} required />
                    </FormGroup>
                    <FormGroup>
                      <Label for="repeatNewPassword">Repeat New Password</Label>
                      <Input type="password" id="repeatNewPassword" bind:value={repeatNewPassword} required />
                    </FormGroup>
                    <Button color="secondary" type="submit" on:click={toggle}>Change Password</Button>
                    <Button color="secondary" on:click={toggle}>Cancel</Button>
                  </Form>
                </ModalBody>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
      
      <Col md="8">
        <Card class="mt-4">
          <CardBody>
            <CardTitle>Token Information</CardTitle>
            <CardText>Tokens Used: {user.tokens_left ?? 0}</CardText>
            <CardText>Tokens Allocated: {user.tokens_allocated ?? 0}</CardText>
            <CardText>Tokens Remaining: {(user.tokens_allocated ?? 0) - (user.tokens_left ?? 0)}</CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>

    <Card class="mt-4">
      <CardBody>
        <CardTitle>Activity Log</CardTitle>
        <div class="log-content">
          {#if user}
            <Logs data={user} filter={filter} />
          {/if}
        </div>
      </CardBody>
    </Card>
  {/if}
</Container>

<style>
  .log-content {
    max-height: 80%;
    overflow-y: auto;
    overflow-x: auto;
    white-space: nowrap;
    min-height: 300px;
    scrollbar-color: orange;
  }
</style>
