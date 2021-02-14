const searchDiv = document.querySelector("#search")
const voltar = document.querySelector("#voltar")

const inputSearch = document.querySelector("#inputSearch")
const buttonSearch = document.querySelector("#buttonSearch")

const userNotFound = document.querySelector("#user-not-found")

const perfilDiv = document.querySelector("#perfil")
const fotoPerfil = document.querySelector("#foto-perfil")
const nomeUsuario = document.querySelector("#nome-usuario")
const numeroSeguidores = document.querySelector("#numero-seguidores")

const repositorios = document.querySelector("#repositorios")

const paginaRepositorio = document.querySelector("#pagina-repositorio")

const mostraInfo = document.querySelector("#mostra-info")
const conteudoInfo = document.querySelector("#conteudo-info")

const linguagens = document.querySelector("#linguagens")

const githubIcon = document.querySelector("#github-icon")
const linkedinIcon = document.querySelector("#linkedin-icon")

githubIcon.onclick = function() {
    window.open("https://github.com/Jhonathansin", "_blank")
}

linkedinIcon.onclick = function() {
    window.open("https://www.linkedin.com/in/jhonathansinzervhc/", "_blank")
}

mostraInfo.addEventListener("click", function() {
    conteudoInfo.innerHTML = ""
    mostraInfo.setAttribute("class", "none")
})

const imagensLinguages = {
    "JavaScript": "js.png",
    "CSS": "css.jpg",
    "HTML": "html.jpg",
    "C#": "csharp.png",
    "PHP": "php.png",
    "Shell": "shell.png",
    "Python": "python.png",
    "C": "c.png",
    "Java": "java.png",
    "Objective-C": "objectivec.png",
    "Go": "go.png",
    "Perl": "perl.png",
    "Ruby": "ruby.png",
    "github": "github.jpg",
}

function voltarPaginaInicial() {
    if (!repositorios.hasAttribute("hidden")) {
        repositorios.innerHTML = ""
        perfilDiv.setAttribute("class", "none")
        paginaRepositorio.setAttribute("class", "none")
        searchDiv.removeAttribute("class")

        if (!userNotFound.hasAttribute("hidden")) {
            userNotFound.setAttribute("hidden", "")
        }
    }
}

function isEquivalent(a, b) {
    let tamanho = 0
    a.forEach(valuea => {
        b.forEach(valueb => {
            if(valuea.name == valueb.name) {
                tamanho += 1
            }
        }) 
    })

    if(a.length == b.length && a.length == tamanho) {
        return true
    } else {
        return false
    }

}

function pegaRepositoriosUsuario(nome) {
    const json = localStorage.getItem(nome)
    
    if (json != null) {
        return JSON.parse(json)
    } else {
        return []
    }
}

function salvaRepositoriosUsuario(nome, objeto) {
    const obj = pegaRepositoriosUsuario(nome)

    if (isEquivalent(objeto, obj)) {
        console.log("repositorio ja está salvo")
    } else {
        const json = JSON.stringify(objeto)

        localStorage.setItem(nome, json)
    }
}

function contaPessoas(usuario, tipo, id) {
    let req = new XMLHttpRequest()
    req.open("GET", `https://api.github.com/users/${usuario}/${tipo}`)

    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            const json = req.responseText
            const obj = JSON.parse(json)
            document.querySelector(`#${id}`).textContent = obj.length
            
        }
    }

    req.send()
}

const Repositorio = {
    name: "",
    imagemPerfil: "",
    seguindo: "",
    language: "",
    url: "",
    cloneUrl: "",
    description: ""
}

function acessarLink(id, url) {
    document.querySelector(`#${id}`).onclick = function() {
        window.open(url, "_blank")
    }
}
    
function entrarPerfil(id, url) {
    acessarLink(id, url)
}

async function infoRepositorio(nome, repositorioNome) {
    // informações sobre o dono do repositorio
    const nomeDono = document.querySelector("#nome-dono-repositorio")
    const fotoPerfil = document.querySelector("#foto-perfil-repositorio")
    const seguindoRepositorio = document.querySelector("#seguindo-repositorio")

    // informações sobre o repositorio
    const nomeRepositorio = document.querySelector("#nome-repositorio")
    const descricaoRepositorio = document.querySelector("#descricao-repositorio")
    const colaboradores = document.querySelector("#colaboradores")
    const branchs = document.querySelector("#branchs")
    const commits = document.querySelector("#commits")
    const linguages = document.querySelector("#linguagens")

    voltar.onclick = function() {
        repositorios.innerHTML = ""
        paginaRepositorio.setAttribute("class", "none")
        searchUser(nome)
    }

    linguages.innerHTML = ""

    const obj = await pegaRepositoriosUsuario(nome.toLowerCase())

    const listaLinguagens = await pegaListaLinguagens(nome, repositorioNome)
    let tamanhoTotalLinguagens = 0
    for (i in listaLinguagens) {
        tamanhoTotalLinguagens += listaLinguagens[i]
    }
    for (i in listaLinguagens) {
        const elementoLinguagem = document.createElement("div")
        elementoLinguagem.setAttribute("class", "elemento-linguagem")

        const imagemLinguagem = document.createElement("div")
        imagemLinguagem.style.backgroundImage = `url(${imagensLinguages[i] || imagensLinguages["github"]})`

        const porcentagemLinguagem = document.createElement("p")
        const textoPorcentagemLinguagem = document.createTextNode(`${((listaLinguagens[i] * 100) / tamanhoTotalLinguagens).toFixed(1)}%`)
        porcentagemLinguagem.append(textoPorcentagemLinguagem)

        elementoLinguagem.append(imagemLinguagem)
        elementoLinguagem.append(porcentagemLinguagem)

        linguages.append(elementoLinguagem)

    }

    let repo = ""

    for (i in obj) {
        if (obj[i]["name"] == repositorioNome) {
            repo = obj[i]
        }
    }
    
    nomeDono.textContent = nome
    nomeDono.onclick = function() {
        window.open(`https://github.com/${nome}`)
    }
    fotoPerfil.style.backgroundImage = `url(${repo["imagemPerfil"]})`

    fotoPerfil.onclick = function() {
        window.open(`https://github.com/${nome}`)
    }

    const seguindo = await contagemSeguindo(repo["seguindo"])
    seguindoRepositorio.textContent = `Seguindo: ${seguindo.length}`

    nomeRepositorio.textContent = repo["name"]

    nomeRepositorio.onclick = function() {
        window.open(`https://github.com/${nome}/${repo["name"]}`)
    }

    let textoDescricao = ""

    if (repo["description"] == null) {
        textoDescricao = "Repositório sem descrição"
    } else {
        textoDescricao = repo["description"]
    }
    descricaoRepositorio.textContent = textoDescricao

    const resColaboradores = await contagemColaboradores(nome.toLowerCase(), repositorioNome)
    colaboradores.textContent = `Colaboradores: ${resColaboradores.length}`

    const resBranchs = await contagemBranchs(nome.toLowerCase(), repositorioNome)
    branchs.textContent = `Branchs: ${resBranchs.length}`

    const resCommits = await contagemCommits(nome.toLowerCase(), repositorioNome)
    commits.textContent = `Commits: ${resCommits.length}`

    seguindoRepositorio.addEventListener("click", function() {
        mostraInfo.removeAttribute("class")
        mostraSeguindo(seguindo)
    })
    
    colaboradores.addEventListener("click", function() {
        mostraInfo.removeAttribute("class")
        mostraColaboradores(resColaboradores)
    })

    branchs.addEventListener("click", function() {
        mostraInfo.removeAttribute("class")
        mostraBranchs(resBranchs)
    })

    commits.addEventListener("click", function() {
        mostraInfo.removeAttribute("class")
        mostraCommits(resCommits)
    })
}

function mostraSeguindo(objeto) {
    conteudoInfo.innerHTML = ""
    if (objeto.length == 0) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>O usuário não segue nenhuma conta</p>`

        conteudoInfo.append(linha)
    }
    for (i in objeto) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>Usuário: ${objeto[i]["login"]}</p>`

        conteudoInfo.append(linha)
    }
}

function mostraColaboradores(objeto) {
    conteudoInfo.innerHTML = ""
    if (objeto.length == 0) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>O repositório não possui colaboradores</p>`

        conteudoInfo.append(linha)
    }
    for (i in objeto) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>Usuário: ${objeto[i]["login"]}</p> <p>Contribuições: ${objeto[i]["contributions"]}</p>`

        conteudoInfo.append(linha)
    }
}

function mostraBranchs(objeto) {
    conteudoInfo.innerHTML = ""
    if (objeto.length == 0) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>O repositório não possui branch</p>`

        conteudoInfo.append(linha)
    }
    for (i in objeto) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>Branch: ${objeto[i]["name"]}</p>`

        conteudoInfo.append(linha)
    }
}

function mostraCommits(objeto) {
    conteudoInfo.innerHTML = ""
    if (objeto.length == 0) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>O repositório não possui commits</p>`

        conteudoInfo.append(linha)
    }
    for (i in objeto) {
        const linha = document.createElement("div")
        linha.innerHTML = `<p>Usuário: ${objeto[i]["commit"]["author"]["name"]}</p> <p>Data: ${objeto[i]["commit"]["author"]["date"]}</p> <p>Commit: ${objeto[i]["commit"]["message"]}</p>`

        conteudoInfo.append(linha)
    }
}

async function pegaListaLinguagens(id, repo) {
    return new Promise(resolve => {
        let req = new XMLHttpRequest()

        req.open("GET", `https://api.github.com/repos/${id}/${repo}/languages`)

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                resolve(JSON.parse(req.responseText))
            }
        }

        req.send()
    })
}

async function contagemCommits(id, repo) {
    return new Promise(resolve => {
        let req = new XMLHttpRequest()

        req.open("GET", `https://api.github.com/repos/${id}/${repo}/commits`)

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                resolve(JSON.parse(req.responseText))
            }
        }

        req.send()
    })
}

async function contagemBranchs(id, repo) {
    return new Promise(resolve => {
        let req = new XMLHttpRequest()

        req.open("GET", `https://api.github.com/repos/${id}/${repo}/branches`)

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                resolve(JSON.parse(req.responseText))
            }
        }

        req.send()
    })
}

async function contagemColaboradores(id, repo) {
    return new Promise(resolve => {
        let req = new XMLHttpRequest()

        req.open("GET", `https://api.github.com/repos/${id}/${repo}/contributors`)

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                resolve(JSON.parse(req.responseText))
            }
        }

        req.send()
    })
}

async function contagemSeguindo(url) {
    return new Promise(resolve => {
        let req = new XMLHttpRequest()

        req.open("GET", url)

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                resolve(JSON.parse(req.responseText))
            }
        }

        req.send()
    })
}

async function searchUser(userId) {
        if (!userNotFound.hasAttribute("hidden")) {
            userNotFound.setAttribute("hidden", "")
        }
        inputSearch.value = ""
        const load = document.querySelector("#load")
        load.removeAttribute("hidden")
        let req = new XMLHttpRequest()

        
        req.open("GET", `https://api.github.com/users/${userId}/repos`)

        req.onreadystatechange = async () => {
            if (req.readyState == 4 && req.status == 200 && JSON.parse(req.responseText) != '') {
                const json = req.responseText
                const obj = JSON.parse(json) 

                voltar.removeAttribute("class")

                voltar.onclick = function() {
                    location.reload()
                }

                load.setAttribute("hidden", "")
                
                searchDiv.setAttribute("class", "none")
                perfilDiv.removeAttribute("class")

                fotoPerfil.src = `${obj[0]["owner"]["avatar_url"]}`
                nomeUsuario.textContent = `${obj[0]["owner"]["login"]}`

                entrarPerfil(fotoPerfil.id, obj[0]["owner"]["html_url"])
                entrarPerfil(nomeUsuario.id, obj[0]["owner"]["html_url"])

                contaPessoas(userId, "followers", "numero-seguidores")
                contaPessoas(userId, "following", "numero-seguindo")

                const infoRepositorios = []

                for (let i in obj) {
                    let repositorio = obj[i]
                    let imagemPerfil = repositorio["owner"]["avatar_url"]
                    let seguindo = `https://api.github.com/users/${repositorio["owner"]["login"]}/following`
                    let name = repositorio["name"]
                    let language = repositorio["language"]
                    let url = repositorio["html_url"]
                    let cloneUrl = repositorio["clone_url"]
                    let description = repositorio["description"]

                    let repositorioAtual = {
                        name,
                        imagemPerfil,
                        seguindo,
                        language,
                        url,
                        cloneUrl,
                        description
                    }

                    infoRepositorios.push(repositorioAtual)
                }
                salvaRepositoriosUsuario(userId, infoRepositorios)

                for (i in infoRepositorios) {
                    const div = document.createElement("div")
                    div.setAttribute("class", "repositorio")

                    const nomeRepo = document.createElement("h2")
                    const textNomeRepo = document.createTextNode(infoRepositorios[i]["name"])
                    nomeRepo.append(textNomeRepo)
                    nomeRepo.setAttribute("class", "nome-repositorio")

                    const logo = document.createElement("div")


                    for (value in imagensLinguages) {
                        if (value == infoRepositorios[i]["language"]) {
                            logo.style.backgroundImage = `url(${imagensLinguages[value]})`
                            break
                        } else {
                            logo.style.backgroundImage = `url(${imagensLinguages["github"]})`
                        }
                    }



                    const acessarRepo = document.createElement("p")
                    acessarRepo.setAttribute("class", `acessarRepo${i}`)
                    const textAcessRepo = document.createTextNode("Acessar Repositório")
                    acessarRepo.append(textAcessRepo)

                    const clonarRepo = document.createElement("p")
                    clonarRepo.setAttribute("class", `clonarRepo${i}`)
                    const textClonarRepo = document.createTextNode("Clonar")
                    clonarRepo.append(textClonarRepo)

                    const maisInfo = document.createElement("p")
                    const textMaisInfo = document.createTextNode("Mais Informação")
                    maisInfo.append(textMaisInfo)

                    const numeroRepo = i

                    nomeRepo.id = `nomeRepo${numeroRepo}`
                    logo.id = `logoRepo${numeroRepo}`

                    maisInfo.addEventListener("click", function() {
                        perfilDiv.setAttribute("class", "none")
                        paginaRepositorio.removeAttribute("class")
                        infoRepositorio(obj[numeroRepo]["owner"]["login"], obj[numeroRepo]["name"])
                    })

                    div.append(nomeRepo)
                    div.append(logo)
                    div.append(acessarRepo)
                    div.append(clonarRepo)
                    div.append(maisInfo)

                    

                    repositorios.append(div)


                    acessarLink(nomeRepo.id, infoRepositorios[numeroRepo]["url"])
                    acessarLink(logo.id, infoRepositorios[numeroRepo]["url"])

                    document.querySelector(`.acessarRepo${i}`).onclick = function() {
                        window.open(infoRepositorios[numeroRepo]["url"], "_blank")
                    }

                    document.querySelector(`.clonarRepo${i}`).onclick = function() {
                        navigator.clipboard.writeText(`git clone ${infoRepositorios[numeroRepo]["cloneUrl"]}`)
                        const cloneButton = this
                        cloneButton.setAttribute("class", "cloned")
                        cloneButton.textContent = "Copiado"
                        
                        setTimeout(function () {
                            cloneButton.removeAttribute("class")
                            cloneButton.textContent = "Clonar"
                        }, 1500)
                    }
                }
            } else if (req.readyState == 4 && req.status == 404 || req.responseText == '') {
                load.setAttribute("hidden", "")
                userNotFound.removeAttribute("hidden")
            }
        }
        req.send()
}

inputSearch.addEventListener("keypress", (event) => {
    if (event.code == "Enter") {
        buttonSearch.click()
    }
})