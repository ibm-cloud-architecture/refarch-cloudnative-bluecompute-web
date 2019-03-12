import com.atlassian.bamboo.specs.api.BambooSpec;
import com.atlassian.bamboo.specs.api.builders.BambooKey;
import com.atlassian.bamboo.specs.api.builders.BambooOid;
import com.atlassian.bamboo.specs.api.builders.notification.Notification;
import com.atlassian.bamboo.specs.api.builders.permission.PermissionType;
import com.atlassian.bamboo.specs.api.builders.permission.Permissions;
import com.atlassian.bamboo.specs.api.builders.permission.PlanPermissions;
import com.atlassian.bamboo.specs.api.builders.plan.Job;
import com.atlassian.bamboo.specs.api.builders.plan.Plan;
import com.atlassian.bamboo.specs.api.builders.plan.PlanIdentifier;
import com.atlassian.bamboo.specs.api.builders.plan.Stage;
import com.atlassian.bamboo.specs.api.builders.plan.branches.BranchCleanup;
import com.atlassian.bamboo.specs.api.builders.plan.branches.PlanBranchManagement;
import com.atlassian.bamboo.specs.api.builders.plan.configuration.ConcurrentBuilds;
import com.atlassian.bamboo.specs.api.builders.project.Project;
import com.atlassian.bamboo.specs.builders.notification.PlanFailedNotification;
import com.atlassian.bamboo.specs.builders.notification.ResponsibleRecipient;
import com.atlassian.bamboo.specs.builders.notification.WatchersRecipient;
import com.atlassian.bamboo.specs.builders.task.CheckoutItem;
import com.atlassian.bamboo.specs.builders.task.ScriptTask;
import com.atlassian.bamboo.specs.builders.task.VcsCheckoutTask;
import com.atlassian.bamboo.specs.builders.trigger.BitbucketServerTrigger;
import com.atlassian.bamboo.specs.util.BambooServer;

@BambooSpec
public class PlanSpec {
    
    public Plan plan() {
        final Plan plan = new Plan(new Project()
                .oid(new BambooOid("k0ldszkwb29"))
                .key(new BambooKey("BLUE"))
                .name("bluecompute")
                .description("For the entire bluecompute project"),
            "Bluecompute Web",
            new BambooKey("BLUEWEB"))
            .oid(new BambooOid("jqw67md2io2"))
            .pluginConfigurations(new ConcurrentBuilds()
                    .useSystemWideDefault(false))
            .stages(new Stage("Stage 1")
                    .jobs(new Job("Job 1",
                            new BambooKey("JOB1"))
                            .tasks(new VcsCheckoutTask()
                                    .checkoutItems(new CheckoutItem().defaultRepository()),
                                new ScriptTask()
                                    .inlineBody("#!/bin/bash\nset -x\ndocker build -t ${bamboo.REGISTRY}/${bamboo.K8S_NAMESPACE}/bluecompute-ce-web:${bamboo.buildNumber} .\ndocker login -u ${bamboo.REGISTRY_USER} -p ${bamboo.REGISTRY_PASSWORD} ${bamboo.REGISTRY}\ndocker push ${bamboo.REGISTRY}/${bamboo.K8S_NAMESPACE}/bluecompute-ce-web:${bamboo.buildNumber}")),
                        new Job("Job 2",
                            new BambooKey("JOB2"))
                            .tasks(new VcsCheckoutTask()
                                    .checkoutItems(new CheckoutItem().defaultRepository()),
                                new ScriptTask()
                                    .inlineBody("#!/bin/bash\nset -x\nexport KUBECONFIG=${bamboo.K8S_CFG_FILE_PATH}\nDEPLOYMENT=$(kubectl --namespace=${bamboo.K8S_NAMESPACE} get deployments -l app=bluecompute,micro=web-bff -o name)\nkubectl --namespace=${bamboo.K8S_NAMESPACE} get ${DEPLOYMENT}\nif [ ${?} -ne \"0\" ]; then echo 'No deployment to update'; exit 1; fi\nkubectl --namespace=${bamboo.K8S_NAMESPACE} set image ${DEPLOYMENT} web=${bamboo.REGISTRY}/${bamboo.K8S_NAMESPACE}/bluecompute-ce-web:${bamboo.buildNumber}\nkubectl --namespace=${bamboo.K8S_NAMESPACE} rollout status ${DEPLOYMENT}"))))
            .linkedRepositories("bluecompute-web")
            
            .triggers(new BitbucketServerTrigger())
            .planBranchManagement(new PlanBranchManagement()
                    .createForVcsBranch()
                    .delete(new BranchCleanup()
                        .whenRemovedFromRepositoryAfterDays(1)
                        .whenInactiveInRepositoryAfterDays(30))
                    .notificationLikeParentPlan())
            .notifications(new Notification()
                    .type(new PlanFailedNotification())
                    .recipients(new ResponsibleRecipient(),
                        new WatchersRecipient()))
            .forceStopHungBuilds();
        return plan;
    }
    
    public PlanPermissions planPermission() {
        final PlanPermissions planPermission = new PlanPermissions(new PlanIdentifier("BLUE", "BLUEWEB"))
            .permissions(new Permissions()
                    .loggedInUserPermissions(PermissionType.VIEW)
                    .anonymousUserPermissionView());
        return planPermission;
    }
    
    public static void main(String... argv) {
        //By default credentials are read from the '.credentials' file.
        BambooServer bambooServer = new BambooServer("http://BAMBOO_SERVER_IP:8085");
        final PlanSpec planSpec = new PlanSpec();
        
        final Plan plan = planSpec.plan();
        bambooServer.publish(plan);
        
        final PlanPermissions planPermission = planSpec.planPermission();
        bambooServer.publish(planPermission);
    }
}