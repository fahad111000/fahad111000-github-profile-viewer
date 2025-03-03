let searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', userDetails)

async function userDetails() {
    let userName = document.getElementById('user-name').value;
    let reposDetails = document.getElementById('repos');
    let repoList = document.getElementById('repoList');

    let url = `https://api.github.com/users/${userName}`

    if (userName === "") {
        alert("Please Enter User Name");
        return;

    }


    try {
        const response = await fetch(`${url}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`This ${userName} is Not Found`)
            }
            else {
                throw new Error(`Server Type of Error`)
            }
        }

        const data = await response.json();

        // Fetch Repositories
        let repoUrl = data.repos_url;
        let totalRepos = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching) {
            const reposResponse = await fetch(`${repoUrl}?page=${page}&per_page=100`);
            const currentRepo = await reposResponse.json()

            if (currentRepo.length === 0) {
                keepFetching = false;
            }
            else {

                // spread Operator
                totalRepos = [...totalRepos, ...currentRepo]
                page++;
            }
        }

        totalRepos.forEach((repo, index) => {
            reposDetails.style.display = "block"
            let repoRow = document.createElement('tr');

            // Repo serial Numbers++
            let repoSno = document.createElement('td');
            repoSno.innerText = index + 1;

            // Repo Id
            let repoID = document.createElement('td');
            repoID.innerText = repo.id;

            // Repo Name
            let repoName = document.createElement('td');
            repoName.innerText = repo.name;


            // Repo Link
            let repoLink = document.createElement('td');
            let repoHref = document.createElement('a');
            repoHref.href = repo.html_url
            repoHref.target = "_blank";
            repoHref.textContent = repo.name;
            repoLink.appendChild(repoHref);


            repoRow.appendChild(repoSno);
            repoRow.appendChild(repoID);
            repoRow.appendChild(repoName);
            repoRow.append(repoLink);

            // repoList.style.fontSize = '10px'
            repoList.appendChild(repoRow);



        });





        let profileDetails = document.getElementById("profile-details");
        profileDetails.innerHTML = `  
                          <div class="card mx-auto">
                        <!-- Profile Image and Details -->
                        <div class="card-body d-flex align-items-center">
                            <!-- Profile Image -->
                            <img src="${data.avatar_url}" alt="Profile" class="profile-img me-3">
                            <!-- Profile Name and Profession -->
                            <div>
                                <h5 class="card-title">${data.login}</h5>
                                <!-- <p class="card-text text-muted">Web Developer</p> -->
                            </div>
                        </div>
        
                        <!-- Card Details (Rows) -->
                        <div class="card-body">
                            <!-- Row 1 -->
                            <div class="row">
                                <div class="col-6"><strong>User Name</strong></div>
                                <div class="col-6">${data.login}</div>
                            </div>
                            <!-- Row 2 -->
                            <div class="row">
                                <div class="col-6"><strong>Follwers</strong></div>
                                <div class="col-6">${data.followers}</div>
                            </div>
                            <!-- Row 3 -->
                            <div class="row">
                                <div class="col-6"><strong>Following</strong></div>
                                <div class="col-6">${data.following}</div>
                            </div>

                            <div class="row">
                                <div class="col-6"><strong>Repos</strong></div>
                                <div class="col-6">${data.public_repos}</div>
                            </div>
        
                        </div>`
    }
    catch (error) {
        console.log(error.message)
    }

}

















// Extra Point how we know in this API(body) have json, hmtl, text or binary
// let contentType = response.headers.get('content-type');
// console.log(contentType);


