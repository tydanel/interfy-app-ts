<script>
    import { dispatch, useSelector } from "../store/redux";
    import { authenticate } from "../store/slices/auth";
    import { selectAuthStatus } from "../store/selectors";
    
	async function handleLogin(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		
        dispatch(authenticate({
			email: formData.get('email'),
			company: formData.get('company'),
			password: formData.get('password'),
            server: formData.get('server')
		}));
	}
    $: authStatus = useSelector(
        selectAuthStatus,
        newValue => authStatus = newValue
    );
</script>

<form on:submit={handleLogin}>
    <div class="mb-3">
        <label for="server">Server URL</label>
        <input class="form-control" type="text" name="server" id="server">
    </div>
    <div class="mb-3">
        <label for="email">Email Addr.</label>
        <input class="form-control" type="email" name="email" id="email">
    </div>
    <div class="mb-3">
        <label for="company">Company</label>
        <input class="form-control" type="text" name="company" id="company">
    </div>
    <div class="mb-3">
        <label for="password">Password</label>
        <input class="form-control" type="password" name="password" id="password">
    </div>
    <div class="mb-3">
        <button class="form-control" type="submit">Login</button>
        <div class="d-flex w-100 justify-content-center">{authStatus}</div>
    </div>
</form>