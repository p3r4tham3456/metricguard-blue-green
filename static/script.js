const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");

const topBtn =
    document.querySelector(".top-btn");

const cursorGlow =
    document.querySelector(".cursor-glow");


/* ================= MOBILE MENU ================= */

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("open");

    });

}


if (navLinks) {

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

            });

        });

}


/* ================= SCROLL REVEAL ================= */

const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target
                        .classList
                        .add("visible");

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


document
    .querySelectorAll(".reveal")
    .forEach(element => {

        observer.observe(element);

    });


/* ================= ACTIVE NAVBAR ================= */

/*
    This automatically detects all sections
    including the new V2 Deployment section.

    Example:
    #home
    #about
    #skills
    #projects
    #deployment
    #contact
*/

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const links =
    document.querySelectorAll(
        ".nav-links a"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(section => {

            if (
                window.scrollY >=
                section.offsetTop - 160
            ) {

                current =
                    section.id;

            }

        });


        links.forEach(link => {

            link.classList.toggle(

                "active",

                link.getAttribute("href")
                    ===
                "#" + current

            );

        });


        /* ================= BACK TO TOP BUTTON ================= */

        if (topBtn) {

            topBtn.classList.toggle(

                "show",

                window.scrollY > 500

            );

        }

    }

);


/* ================= BACK TO TOP ================= */

if (topBtn) {

    topBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ================= MOUSE GLOW ================= */

if (cursorGlow) {

    window.addEventListener(
        "mousemove",
        (event) => {

            cursorGlow.style.left =
                event.clientX + "px";

            cursorGlow.style.top =
                event.clientY + "px";

        }
    );

}


/* ================= V2 DEPLOYMENT STATUS ================= */

/*
    MetricGuard V2

    This section gives a small visual animation
    to the deployment status card.

    It does NOT perform an actual deployment.
    Jenkins/Nginx/Docker will handle the real
    deployment later.
*/

const deploymentStatus =
    document.querySelector(
        ".deployment-section .live-badge"
    );


if (deploymentStatus) {

    deploymentStatus.classList.add(
        "deployment-active"
    );

}


/* ================= DEPLOYMENT PIPELINE ================= */

/*
    Highlight the deployment pipeline steps
    when the Deployment section enters the screen.
*/

const deploymentSection =
    document.querySelector(
        "#deployment"
    );

const pipelineSteps =
    document.querySelectorAll(
        ".pipeline-step"
    );


if (
    deploymentSection &&
    pipelineSteps.length > 0
) {

    const deploymentObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        pipelineSteps.forEach(
                            (step, index) => {

                                setTimeout(
                                    () => {

                                        step.classList.add(
                                            "pipeline-active"
                                        );

                                    },
                                    index * 250
                                );

                            }
                        );

                        deploymentObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.25
            }

        );


    deploymentObserver.observe(
        deploymentSection
    );

}
